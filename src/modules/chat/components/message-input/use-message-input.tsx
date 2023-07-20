import { matrixClient } from "~/modules/matrix/matrix-client";
import { useRoomStateContext } from "../chat-room/contexts/room-state-context/room-state-context";

export const useMessageInput = () => {
    const { room } = useRoomStateContext();

    const sendTextMessage = async (text?: string) => {
        if (!text?.trim()) {
            return;
        }

        const roomId = room?.roomId;

        if (!roomId) {
            return;
        }

        await matrixClient.sendTextMessage(roomId, text);
    };

    return {
        sendTextMessage,
    };
};
