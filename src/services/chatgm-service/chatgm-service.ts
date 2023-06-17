import { axiosClient } from './axios-client';
import { LoginWithHandleRequest, LoginWithHandleResponse } from './dtos';

export class ChatGmService {
    async loginWithHandle(
        dto: LoginWithHandleRequest
    ): Promise<LoginWithHandleResponse> {
        const response = await axiosClient.post('/auth/login/email', {
            handle: dto.handle,
            password: dto.password,
        });

        return response.data;
    }
}
