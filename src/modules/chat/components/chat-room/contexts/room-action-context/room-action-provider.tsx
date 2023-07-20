import { PropsWithChildren } from "react";
import { matrixClient } from "~/modules/matrix/matrix-client";
import { useRoomStateContext } from "../room-state-context/room-state-context";
import { RoomActionContext } from "./room-action-context";

export type RoomActionProviderProps = PropsWithChildren;

export const RoomActionProvider = ({ children }: RoomActionProviderProps) => {
    const { roomId } = useRoomStateContext();

    const sendTextMessage = async (text: string) => {
        if (!roomId) {
            throw new Error("roomId is undefined");
        }

        await matrixClient.sendTextMessage(roomId, text);
    };

    return (
        <RoomActionContext.Provider
            value={{
                sendTextMessage,
            }}
        >
            {children}
        </RoomActionContext.Provider>
    );
};
