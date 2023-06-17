import {
    ICreateClientOpts,
    IMatrixClientCreateOpts,
    MatrixClient,
    MatrixScheduler,
    MemoryCryptoStore,
    MemoryStore,
    Preset,
    Room,
} from 'matrix-js-sdk';
import { LoginWithAccessTokenResponse } from './dtos';
import { CryptoStore } from 'matrix-js-sdk/lib/crypto/store/base';
import {
    transformToChatGmUserId,
    transformToMatrixUserId,
    makeRoomAlias,
    makeRoomName,
} from './utils';
import { resolvePromise } from '../../utils';

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

    async createChatGmRoom(targetChatGmUserIds: Array<string>) {
        const matrixMeUserId = this.getUserId();
        if (!matrixMeUserId) return;

        const chatGmMeUserId = transformToChatGmUserId(matrixMeUserId);
        if (!chatGmMeUserId) return;

        const chatGmUserIds = [chatGmMeUserId, ...targetChatGmUserIds];
        const roomName = makeRoomName(chatGmUserIds);
        const roomAlias = makeRoomAlias(roomName);

        const [getRoomIdForAliasRes, getRoomIdForAliasErr] =
            await resolvePromise(this.getRoomIdForAlias(roomAlias));

        if (!getRoomIdForAliasErr && getRoomIdForAliasRes) {
            const room = await this.getRoomUntilTimeout(
                getRoomIdForAliasRes.room_id
            );

            return room;
        }

        const [createRoomRes, createRoomErr] = await resolvePromise(
            this.createRoom({
                is_direct: true,
                preset: Preset.TrustedPrivateChat,
                name: roomName,
                room_alias_name: roomName,
                invite: targetChatGmUserIds.map(transformToMatrixUserId),
            })
        );

        if (createRoomErr || !createRoomRes) {
            throw new Error('Fail to create room');
        }

        const room = await this.getRoomUntilTimeout(
            createRoomRes.room_id,
            60000
        );

        return room;
    }
}
