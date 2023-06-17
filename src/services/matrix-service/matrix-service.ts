import {
    ICreateClientOpts,
    IMatrixClientCreateOpts,
    MatrixClient,
    MatrixScheduler,
    MemoryCryptoStore,
    MemoryStore,
} from 'matrix-js-sdk';
import { LoginWithAccessTokenResponse } from './dtos';
import { CryptoStore } from 'matrix-js-sdk/lib/crypto/store/base';

const BASE_URL = 'https://matrix.tauhu.cloud';

function cryptoStoreFactory(): CryptoStore {
    return new MemoryCryptoStore();
}

function amendClientOpts(opts: ICreateClientOpts): ICreateClientOpts {
    opts.store =
        opts.store ??
        new MemoryStore({
            // @ts-ignore
            localStorage: global.localStorage,
        });
    opts.scheduler = opts.scheduler ?? new MatrixScheduler();
    opts.cryptoStore = opts.cryptoStore ?? cryptoStoreFactory();

    return opts;
}

export class MatrixService extends MatrixClient {
    private constructor(opts: Omit<IMatrixClientCreateOpts, 'baseUrl'>) {
        super(
            amendClientOpts({
                baseUrl: BASE_URL,
                ...opts,
            })
        );
    }

    static createClient(
        opts: Omit<IMatrixClientCreateOpts, 'baseUrl'>
    ): MatrixService {
        return new MatrixService(opts);
    }

    async loginWithAccessToken(
        accessToken: string
    ): Promise<LoginWithAccessTokenResponse> {
        const response = await super.login('org.matrix.login.jwt', {
            token: accessToken,
        });

        return {
            userId: response.user_id,
            accessToken: response.access_token,
        };
    }
}
