import {
    EventType,
    ICreateClientOpts,
    IMatrixClientCreateOpts,
    MatrixClient as BaseMatrixClient,
    MatrixScheduler,
    MemoryCryptoStore,
    MemoryStore,
    Preset,
    Room,
    ClientEvent,
    PendingEventOrdering,
} from 'matrix-js-sdk';
import { LoginWithAccessTokenResponse } from './dtos/auth';
import { CryptoStore } from 'matrix-js-sdk/lib/crypto/store/base';
import {
    transformToChatGmUserId,
    transformToMatrixUserId,
    makeRoomAlias,
    makeRoomName,
} from './utils';
import { resolvePromise } from '~/modules/common/utils';
import { DEFAULT_HOME_SERVER } from './configs';
import { useAuthStore } from './stores/auth-store';
import { SyncState } from 'matrix-js-sdk/lib/sync';

function cryptoStoreFactory(): CryptoStore {
    return new MemoryCryptoStore();
}

function amendClientOpts(opts: ICreateClientOpts): ICreateClientOpts {
    opts.store =
        opts.store ??
        new MemoryStore({
            localStorage: global.localStorage,
        });
    opts.scheduler = opts.scheduler ?? new MatrixScheduler();
    opts.cryptoStore = opts.cryptoStore ?? cryptoStoreFactory();

    return opts;
}

export class MatrixClient extends BaseMatrixClient {
    private constructor(opts: IMatrixClientCreateOpts) {
        super(amendClientOpts(opts));
    }

    static createClient(opts: IMatrixClientCreateOpts): MatrixClient {
        return new MatrixClient(opts);
    }

    async startClient(): Promise<void> {
        console.log('[MatrixClient]: startClient');
        return new Promise((resolve, reject) => {
            this.once(ClientEvent.Sync, (state, _, data) => {
                if (state === SyncState.Error) {
                    reject(`Sync failed: ${data?.error}`);
                    console.log('[MatrixClient]: sync failed');
                    return;
                }

                if (state === SyncState.Prepared) {
                    resolve();
                    console.log('[MatrixClient]: sync succeeded');
                    return;
                }
            });

            super.startClient({
                pendingEventOrdering: PendingEventOrdering.Detached,
            });
        });
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
        timeout = 30000
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

    async sendReaction(roomId: string, eventId: string, reaction: string) {
        const reactionEvents = await this.fetchReactions(roomId, eventId);

        const sameReactionEventSent = reactionEvents.find((e) => {
            const isSelf = this.getUserId() === e.getSender();
            const eventKey = e.getContent()['m.relates_to']?.key;
            return isSelf && eventKey === reaction;
        });

        if (sameReactionEventSent) {
            const sameReactionEventSentId = sameReactionEventSent.getId();
            if (sameReactionEventSentId) {
                await this.redactEvent(
                    roomId,
                    sameReactionEventSentId,
                    undefined,
                    {
                        reason: 'client:toggle-reaction',
                    }
                );
            }
            return;
        }

        const otherReactionEvents = reactionEvents.filter((e) => {
            const isSelf = this.getUserId() === e.getSender();
            return isSelf;
        });

        if (otherReactionEvents.length > 0) {
            for (let i = 0; i < otherReactionEvents.length; ++i) {
                const otherReactionEvent = otherReactionEvents[i];
                const otherReactionEventId = otherReactionEvent.getId();
                if (otherReactionEventId) {
                    await this.redactEvent(
                        roomId,
                        otherReactionEventId,
                        undefined,
                        {
                            reason: 'client:replace-reaction',
                        }
                    );
                }
            }
        }

        await this.sendEvent(roomId, EventType.Reaction, {
            'm.relates_to': {
                event_id: eventId,
                key: reaction,
                rel_type: 'm.annotation',
            },
        });
    }

    async fetchReactions(roomId: string, eventId: string) {
        const response = await this.relations(
            roomId,
            eventId,
            'm.annotation',
            EventType.Reaction
        );

        return response.events;
    }
}

export const matrixClient = MatrixClient.createClient({
    baseUrl: DEFAULT_HOME_SERVER,
    userId: useAuthStore.getState().authUser?.userId,
    accessToken: useAuthStore.getState().authUser?.accessToken,
});
