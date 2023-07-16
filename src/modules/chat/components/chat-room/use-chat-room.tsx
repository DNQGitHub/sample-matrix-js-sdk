import { MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { matrixClient } from '~/modules/matrix/matrix-client';

export type UseChatRoomProps = {
    roomId?: string;
};

export const useChatRoom = ({ roomId }: UseChatRoomProps) => {
    const [room, setRoom] = useState<Room>();
    const [events, setEvents] = useState<MatrixEvent[]>([]);
    const [eventReadUpTo, setEventReadUpTo] = useState<MatrixEvent | null>();

    const initializeHandler = useMutation({
        mutationFn: async () => {
            const room = matrixClient.getRoom(roomId);

            if (!room) {
                throw new Error(`Cannot get room with id ${roomId}`);
            }

            setRoom(room);

            const myId = matrixClient.getUserId();

            if (myId) {
                const eventReadUpToId = room.getEventReadUpTo(myId);

                const eventReadUpTo = room
                    .getLiveTimeline()
                    .getEvents()
                    .find((e) => e.getId() === eventReadUpToId);

                setEventReadUpTo(eventReadUpTo);
            }
        },
    });

    useEffect(
        () => {
            initializeHandler.mutate();

            return () => {
                setRoom(undefined);
                setEvents([]);
            };
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [roomId]
    );

    useEffect(() => {
        const handleRoomTimeline = (_: MatrixEvent, _room?: Room) => {
            if (room && _room && room.roomId === _room.roomId) {
                setEvents([
                    ..._room.getLiveTimeline().getEvents(),
                    ..._room.getPendingEvents(),
                ]);
            }
        };

        if (room) {
            setEvents([
                ...room.getLiveTimeline().getEvents(),
                ...room.getPendingEvents(),
            ]);
        }

        matrixClient.on(RoomEvent.Timeline, handleRoomTimeline);
        matrixClient.on(RoomEvent.LocalEchoUpdated, handleRoomTimeline);

        return () => {
            matrixClient.off(RoomEvent.Timeline, handleRoomTimeline);
            matrixClient.off(RoomEvent.LocalEchoUpdated, handleRoomTimeline);
        };
    }, [room]);

    return { room, events, eventReadUpTo, initializeHandler };
};
