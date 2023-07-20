import { MatrixEvent, Room } from "matrix-js-sdk";
import { createContext, useContext } from "react";

export type RoomStateContextValue = {
    isLoading?: boolean;
    error?: unknown;
    roomId?: string;
    room?: Room;
    events: MatrixEvent[];
    eventReadUpTo?: MatrixEvent;
};

export const RoomStateContext = createContext({} as RoomStateContextValue);

export const useRoomStateContext = () => {
    const context = useContext(RoomStateContext);

    if (!context)
        throw new Error("Miss wrapping with RoomStateContext.Provider");

    return context;
};
