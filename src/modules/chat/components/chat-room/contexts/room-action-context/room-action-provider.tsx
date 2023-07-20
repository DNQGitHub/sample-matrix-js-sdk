import { EventStatus, MatrixEvent } from "matrix-js-sdk";
import { PropsWithChildren } from "react";
import { matrixClient } from "~/modules/matrix/matrix-client";
import { useRoomStateContext } from "../room-state-context/room-state-context";
import { RoomActionContext } from "./room-action-context";

export type RoomActionProviderProps = PropsWithChildren;

export const RoomActionProvider = ({ children }: RoomActionProviderProps) => {
    const { roomId, room } = useRoomStateContext();

    const sendTextMessage = async (text: string) => {
        if (!roomId) {
            throw new Error("roomId is undefined");
        }

        if (text.trim() === "") {
            return;
        }

        await matrixClient.sendTextMessage(roomId, text);
    };

    const resendEvent = async (event: MatrixEvent) => {
        if (!room) {
            throw new Error("room is undefined");
        }

        if (event.status !== EventStatus.NOT_SENT) {
            return;
        }

        await matrixClient.resendEvent(event, room);
    };

    const reactEvent = async (event: MatrixEvent, key: string) => {
        if (!roomId) {
            throw new Error("roomId is undefined");
        }

        const eventId = event.getId();

        if (!eventId) {
            throw new Error("eventId is undefined");
        }

        await matrixClient.sendReaction(roomId, eventId, key);
    };

    const scrollback = async () => {
        if (!room) {
            throw new Error("room is undefined");
        }

        await matrixClient.scrollback(room);
    };

    return (
        <RoomActionContext.Provider
            value={{
                sendTextMessage,
                resendEvent,
                reactEvent,
                scrollback,
            }}
        >
            {children}
        </RoomActionContext.Provider>
    );
};
