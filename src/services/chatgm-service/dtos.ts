export type LoginWithHandleRequest = {
    handle: string;
    password: string;
};

export type LoginWithHandleResponse = {
    data: {
        handle: string;
        access_token: string;
        email: string;
        evm_wallet_address: string;
        btc_wallet_address: string;
    };
    message: string;
    status: number;
};
