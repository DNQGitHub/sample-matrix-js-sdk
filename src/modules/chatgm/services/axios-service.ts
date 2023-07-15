import { apiClient } from '../axios-client';

export class AxiosService {
    injectAccessToken(accessToken: string) {
        apiClient.defaults.headers.common['Authorization'] =
            'Bearer ' + accessToken;
    }

    ejectAccessToken() {
        apiClient.defaults.headers.common['Authorization'] = undefined;
    }
}
