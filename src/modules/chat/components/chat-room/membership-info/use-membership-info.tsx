import { useMutation } from 'react-query';
import { useChatRoomContext } from '../chat-room-context';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useMembershipInfo = () => {
    const { room } = useChatRoomContext();

    const joinRoomHandler = useMutation({
        mutationFn: async () => {
            if (!room) {
                return;
            }

            await matrixClient.joinRoom(room.roomId);
        },
    });

    return { joinRoomHandler };
};
