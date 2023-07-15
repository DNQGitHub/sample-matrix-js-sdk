import { Room } from 'matrix-js-sdk';
import { createContext, useContext } from 'react';

export type RoomListContextValue = {
    rooms: Room[];
    selectedRoom?: Room;
    setSelectedRoom: (room?: Room) => void;
};

export const RoomListContext = createContext<RoomListContextValue>(
    {} as RoomListContextValue
);

export const useRoomListContext = () => {
    const context = useContext(RoomListContext);

    if (!context)
        throw new Error('Miss wrapping with RoomListContext.Provider');

    return context;
};
