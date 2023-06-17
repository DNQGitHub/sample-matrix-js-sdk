import { useMatrixContext } from '../../../contexts';
import { useAuthStore } from '../../../stores/auth-store';

export const useActionBar = () => {
    const {
        matrixClient,
        startMatrixClient,
        stopMatrixClient,
        setSelectedRoom,
    } = useMatrixContext();

    const isLogined = useAuthStore(
        (s) => !!s.authChatGmUser && !!s.authMatrixUser
    );

    const handleStartMatrixClient = async () => {
        if (!isLogined) return;
        startMatrixClient();
    };

    const handleStopMatrixClient = async () => {
        if (!isLogined) return;
        stopMatrixClient();
    };

    const handleCreateSoloRoom = async (
        targetChatGmUserId: string = 'gm.qtest4'
    ) => {
        try {
            if (!isLogined) return;

            const room = await matrixClient.createChatGmRoom([
                targetChatGmUserId,
            ]);

            if (room) setSelectedRoom(room);
        } catch (error: any) {
            console.log('create solo room', { error });
        }
    };

    const handleCreateGroupRoom = async (
        targetChatGmUserIds: Array<string> = ['gm.qtest2', 'gm.qtest5']
    ) => {
        try {
            if (!isLogined) return;

            const room = await matrixClient.createChatGmRoom(
                targetChatGmUserIds
            );

            if (room) setSelectedRoom(room);
        } catch (error: any) {
            console.log('create group room', { error });
        }
    };

    return {
        matrixClient,
        handleStartMatrixClient,
        handleStopMatrixClient,
        handleCreateSoloRoom,
        handleCreateGroupRoom,
    };
};
