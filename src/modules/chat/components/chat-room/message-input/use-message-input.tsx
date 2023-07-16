import { matrixClient } from '~/modules/matrix/matrix-client';
import { useChatRoomContext } from '../chat-room-context';

export const useMessageInput = () => {
    const { room } = useChatRoomContext();

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
