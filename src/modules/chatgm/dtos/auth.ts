import { ApiResponse } from './base';

export type LoginWithUserHandleRequest = {
    handle: string;
    password: string;
};

export type LoginWithUserHandleResponse = ApiResponse<{
    handle: string;
    access_token: string;
    email: string;
    evm_wallet_address: string;
    btc_wallet_address: string;
}>;
