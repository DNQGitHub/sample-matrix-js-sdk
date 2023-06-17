import { useMatrixContext } from '../../../contexts';
import { ChatGmService } from '../../../services';
import { injectAccessToken } from '../../../services/chatgm-service/axios-client';
import { LoginWithHandleRequest } from '../../../services/chatgm-service/dtos';
import { useAuthStore } from '../../../stores/auth-store';
import { resolvePromise } from '../../../utils';

export const useLoginForm = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    const { matrixClient } = useMatrixContext();

    const handleLoginWithHandle = async (dto: LoginWithHandleRequest) => {
        const chatGmService = new ChatGmService();

        const [chatGmloginWithHandlerRes, chatGmloginWithHandleErr] =
            await resolvePromise(chatGmService.loginWithHandle(dto));

        if (chatGmloginWithHandleErr || !chatGmloginWithHandlerRes) return;

        const authChatGmUser = {
            handle: chatGmloginWithHandlerRes.data.handle,
            accessToken: chatGmloginWithHandlerRes.data.access_token,
        };

        const [matrixloginWithAccessTokenRes, matrixloginWithAccessTokenErr] =
            await resolvePromise(
                matrixClient.loginWithAccessToken(authChatGmUser.accessToken)
            );

        if (matrixloginWithAccessTokenErr || !matrixloginWithAccessTokenRes)
            return;

        const authMatrixUser = {
            userId: matrixloginWithAccessTokenRes.userId,
            accessToken: matrixloginWithAccessTokenRes.accessToken,
        };

        injectAccessToken(authChatGmUser.accessToken);

        setAuth(authChatGmUser, authMatrixUser);
    };

    const handleLogout = () => {
        setAuth(undefined);
    };

    return {
        handleLoginWithHandle,
        handleLogout,
    };
};
