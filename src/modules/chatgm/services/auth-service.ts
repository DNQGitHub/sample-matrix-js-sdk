import { apiClient } from '../axios-client';
import {
    LoginWithUserHandleRequest,
    LoginWithUserHandleResponse,
} from '../dtos/auth';

export class AuthService {
    async loginWithUserHandle(
        dto: LoginWithUserHandleRequest
    ): Promise<LoginWithUserHandleResponse> {
        const response = await apiClient.post('/auth/login/email', {
            handle: dto.handle,
            password: dto.password,
        });

        return response.data;
    }
}
