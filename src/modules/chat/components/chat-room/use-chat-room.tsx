import {
    ClientEvent,
    EventType,
    MatrixEvent,
    Room,
    RoomEvent,
} from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { ALLOW_VISIBLE_EVENT_TYPES } from '~/modules/matrix/configs';
import { EVENT_UPDATE_REQUESTED } from '~/modules/matrix/constants';
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
            if (!roomId) {
                return;
            }

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
                    .filter((e) =>
                        ALLOW_VISIBLE_EVENT_TYPES.includes(e.getType())
                    )
                    .find((e, index, events) => {
                        return (
                            index < events.length - 1 &&
                            e.getId() === eventReadUpToId
                        );
                    });

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
                setEvents(
                    [
                        ..._room.getLiveTimeline().getEvents(),
                        ..._room.getPendingEvents(),
                    ].filter((e) =>
                        ALLOW_VISIBLE_EVENT_TYPES.includes(e.getType())
                    )
                );
            }
        };

        const handleRoomEvent = (event: MatrixEvent) => {
            if (event.getType() === EventType.Reaction) {
                const relatedEventId =
                    event.getContent()['m.relates_to']?.event_id;

                const foundEvent = room
                    ?.getLiveTimeline()
                    .getEvents()
                    .filter((e) =>
                        ALLOW_VISIBLE_EVENT_TYPES.includes(e.getType())
                    )
                    .find((e) => {
                        const eventId = e.getId();
                        return (
                            eventId &&
                            relatedEventId &&
                            eventId === relatedEventId
                        );
                    });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                foundEvent?.emit<any>(EVENT_UPDATE_REQUESTED);
            }
        };

        if (room) {
            setEvents(
                [
                    ...room.getLiveTimeline().getEvents(),
                    ...room.getPendingEvents(),
                ].filter((e) => ALLOW_VISIBLE_EVENT_TYPES.includes(e.getType()))
            );
        }

        matrixClient.on(RoomEvent.Timeline, handleRoomTimeline);
        matrixClient.on(RoomEvent.LocalEchoUpdated, handleRoomTimeline);
        matrixClient.on(ClientEvent.Event, handleRoomEvent);

        return () => {
            matrixClient.off(RoomEvent.Timeline, handleRoomTimeline);
            matrixClient.off(RoomEvent.LocalEchoUpdated, handleRoomTimeline);
            matrixClient.off(ClientEvent.Event, handleRoomEvent);
        };
    }, [room]);

    return { room, events, eventReadUpTo, initializeHandler };
};
