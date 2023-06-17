import {
    ICreateClientOpts,
    IMatrixClientCreateOpts,
    MatrixClient,
    MatrixScheduler,
    MemoryCryptoStore,
    MemoryStore,
    Room,
} from 'matrix-js-sdk';
import { LoginWithAccessTokenResponse } from './dtos';
import { CryptoStore } from 'matrix-js-sdk/lib/crypto/store/base';

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
    private constructor(opts: IMatrixClientCreateOpts) {
        super(amendClientOpts(opts));
    }

    static createClient(opts: IMatrixClientCreateOpts): MatrixService {
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

    async getRoomUntilTimeout(
        roomId?: string,
        timeout: number = 30000
    ): Promise<Room | null> {
        return new Promise((resolve, reject) => {
            if (!roomId) return resolve(null);

            let room: Room | null = null;
            const startTime = Date.now();

            do {
                if (Date.now() - startTime > timeout) {
                    return reject(`Timeout, cannot get room with id ${roomId}`);
                }

                room = this.getRoom(roomId);
            } while (room === null);

            return resolve(room);
        });
    }
}
