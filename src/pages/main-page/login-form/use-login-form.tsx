import { AuthService, ChatGmService } from '~/services';
import { LoginWithHandleRequest } from '~/services/chatgm-service/dtos';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';

export const useLoginForm = () => {
    const { matrixClient, stopMatrixClient } = useMatrixContext();

    const handleLoginWithHandle = async (dto: LoginWithHandleRequest) => {
        const chatGmService = new ChatGmService();
        const authService = new AuthService();
        await authService.loginWithChatGmHandle(
            chatGmService,
            matrixClient,
            dto
        );
    };

    const handleLogout = async () => {
        const authService = new AuthService();

        await authService.logout();
        stopMatrixClient();
    };

    return {
        handleLoginWithHandle,
        handleLogout,
    };
};
