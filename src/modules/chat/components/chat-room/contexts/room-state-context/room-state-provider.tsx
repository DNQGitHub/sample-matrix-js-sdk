import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { matrixClient } from "~/modules/matrix/matrix-client";
import { RoomStateContext } from "./room-state-context";

export type RoomStateProviderProps = PropsWithChildren<{
    roomId?: string;
}>;

export const RoomStateProvider = ({
    children,
    roomId,
}: RoomStateProviderProps) => {
    const [_isLoading, setIsLoading] = useState<boolean>();
    const [_error, setError] = useState<unknown>();
    const [_room, setRoom] = useState<Room>();
    const [_events, setEvents] = useState<MatrixEvent[]>([]);
    const [_eventReadUpTo, setEventReadUpTo] = useState<MatrixEvent>();

    const loadRoom = async () => {
        try {
            setIsLoading(true);

            const room = await matrixClient.getRoomUntilTimeout(roomId);

            if (!room) {
                throw new Error(`Cannot get room by id ${roomId}`);
            }

            const userId = matrixClient.getUserId();

            if (!userId) {
                throw new Error("userId is undefined");
            }

            const events = [
                ...(room?.getLiveTimeline().getEvents() || []),
                ...(room?.getPendingEvents() || []),
            ];

            const eventReadUpToId = room.getEventReadUpTo(userId);
            const eventReadUpTo = eventReadUpToId
                ? events.find((e) => e.getId() === eventReadUpToId)
                : undefined;

            setRoom(room || undefined);
            setEvents(events);
            setEventReadUpTo(eventReadUpTo);
        } catch (error: unknown) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoom();

        return () => {
            setIsLoading(undefined);
            setError(undefined);
            setRoom(undefined);
            setEvents([]);
            setEventReadUpTo(undefined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    useEffect(() => {
        const handleRoomTimeline = (_: MatrixEvent, room?: Room) => {
            setEvents([
                ...(room?.getLiveTimeline().getEvents() || []),
                ...(room?.getPendingEvents() || []),
            ]);
        };

        const handleLocalEchoUpdated = (_: MatrixEvent, room?: Room) => {
            setEvents([
                ...(room?.getLiveTimeline().getEvents() || []),
                ...(room?.getPendingEvents() || []),
            ]);
        };

        matrixClient.on(RoomEvent.Timeline, handleRoomTimeline);
        matrixClient.on(RoomEvent.LocalEchoUpdated, handleLocalEchoUpdated);

        return () => {
            matrixClient.off(RoomEvent.Timeline, handleRoomTimeline);
            matrixClient.off(
                RoomEvent.LocalEchoUpdated,
                handleLocalEchoUpdated
            );
        };
    }, [_room]);

    return (
        <RoomStateContext.Provider
            value={{
                isLoading: _isLoading,
                error: _error,
                room: _room,
                events: _events,
                eventReadUpTo: _eventReadUpTo,
            }}
        >
            {children}
        </RoomStateContext.Provider>
    );
};
