import { createContext, useContext } from "react";

export type RoomActionContextValue = {
    sendTextMessage: (text: string) => Promise<void>;
};

export const RoomActionContext = createContext({} as RoomActionContextValue);

export const useRoomActionContext = () => {
    const context = useContext(RoomActionContext);

    if (!context)
        throw new Error("Miss wrapping with RoomActionContext.Provider");

    return context;
};
