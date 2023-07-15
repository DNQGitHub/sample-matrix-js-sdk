import { AuthService as ChatGmAuthService } from '~/modules/chatgm/services/auth-service';
import { AxiosService as ChatGmAxiosService } from '~/modules/chatgm/services/axios-service';
import { LoginWithUserHandleRequest } from '~/modules/chatgm/dtos/auth';
import { matrixClient } from '~/modules/matrix/matrix-client';
import { useAuthStore as useChatGmAuthStore } from '../chatgm/stores/auth-store';
import { useAuthStore as useMatrixAuthStore } from '../matrix/stores/auth-store';
import { resolvePromise } from '../common/utils';

export class AuthService {
    private chatGmAxiosService: ChatGmAxiosService;
    private chatGmAuthService: ChatGmAuthService;

    constructor() {
        this.chatGmAuthService = new ChatGmAuthService();
        this.chatGmAxiosService = new ChatGmAxiosService();
    }

    async hasUserLogined() {
        return (
            useChatGmAuthStore.getState().authUser &&
            useMatrixAuthStore.getState().authUser
        );
    }

    async loginWithChatGmUserHandle(dto: LoginWithUserHandleRequest) {
        const chatGmLoginResponse =
            await this.chatGmAuthService.loginWithUserHandle(dto);

        const chatGmAuthUser = {
            userHandle: chatGmLoginResponse.data.handle,
            accessToken: chatGmLoginResponse.data.access_token,
        };

        const matrixLoginResponse = await matrixClient.loginWithAccessToken(
            chatGmAuthUser.accessToken
        );

        const matrixAuthUser = {
            userId: matrixLoginResponse.userId,
            accessToken: matrixLoginResponse.accessToken,
        };

        this.chatGmAxiosService.injectAccessToken(chatGmAuthUser.accessToken);

        useChatGmAuthStore.getState().setAuthUser(chatGmAuthUser);
        useMatrixAuthStore.getState().setAuthUser(matrixAuthUser);
    }

    async logout() {
        this.chatGmAxiosService.ejectAccessToken();

        await matrixClient.logout(true);
        matrixClient.removeAllListeners();
        matrixClient.stopClient();

        await resolvePromise(matrixClient.clearStores());

        useChatGmAuthStore.getState().setAuthUser(undefined);
        useMatrixAuthStore.getState().setAuthUser(undefined);
    }
}
