import { MatrixService } from '~/services/matrix-service/matrix-service';
import { ChatGmService } from '~/services/chatgm-service/chatgm-service';
import { LoginWithHandleRequest } from '~/services/chatgm-service/dtos';
import { resolvePromise } from '~/utils';
import { useAuthStore } from './auth-store';
import {
    ejectAccessToken,
    injectAccessToken,
} from '~/services/chatgm-service/axios-client';

export class AuthService {
    async loginWithChatGmHandle(
        chatGmService: ChatGmService,
        matrixService: MatrixService,
        dto: LoginWithHandleRequest
    ) {
        const [chatGmloginWithHandlerRes, chatGmloginWithHandleErr] =
            await resolvePromise(chatGmService.loginWithHandle(dto));

        if (chatGmloginWithHandleErr || !chatGmloginWithHandlerRes) return;

        const authChatGmUser = {
            handle: chatGmloginWithHandlerRes.data.handle,
            accessToken: chatGmloginWithHandlerRes.data.access_token,
        };

        const [matrixloginWithAccessTokenRes, matrixloginWithAccessTokenErr] =
            await resolvePromise(
                matrixService.loginWithAccessToken(authChatGmUser.accessToken)
            );

        if (matrixloginWithAccessTokenErr || !matrixloginWithAccessTokenRes)
            return;

        const authMatrixUser = {
            userId: matrixloginWithAccessTokenRes.userId,
            accessToken: matrixloginWithAccessTokenRes.accessToken,
        };

        injectAccessToken(authChatGmUser.accessToken);

        useAuthStore.getState().setAuth(authChatGmUser, authMatrixUser);
    }

    async logout() {
        ejectAccessToken();
        useAuthStore.getState().setAuth(undefined);
    }
}
