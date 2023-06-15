import { Preset } from 'matrix-js-sdk';
import { useMatrixContext } from '../../../contexts';
import {
    getUserId,
    makeMatrixUserId,
    makeRoomAlias,
    makeRoomName,
    resolvePromise,
} from '../../../utils';

export const useActionBar = () => {
    const {
        matrixClient,
        startMatrixClient,
        stopMatrixClient,
        setSelectedRoom,
    } = useMatrixContext();

    const handleStartMatrixClient = () => {
        if (matrixClient) return;

        startMatrixClient({
            baseUrl: 'https://matrix.tauhu.cloud',
            userId: '@gm.qtest1:matrix.tauhu.cloud',
            accessToken: 'syt_Z20ucXRlc3Qx_pSAbqeJzXYiXLAbiAKUy_1UWIWe',
        });
    };

    const handleStopMatrixClient = () => {
        if (!matrixClient) return;

        stopMatrixClient();
    };

    const handleCreateSoloRoom = async (targetUserId: string = 'gm.qtest4') => {
        try {
            if (!matrixClient) return;

            const matrixClientUserId = matrixClient.getUserId();
            if (!matrixClientUserId) return;

            const clientUserId = getUserId(matrixClientUserId);
            if (!clientUserId) return;

            const userIds = [clientUserId, targetUserId];
            const roomName = makeRoomName(userIds);
            const roomAlias = makeRoomAlias(roomName);

            const [getRoomIdForAliasRes, getRoomIdForAliasErr] =
                await resolvePromise(matrixClient.getRoomIdForAlias(roomAlias));

            if (!getRoomIdForAliasErr && getRoomIdForAliasRes) {
                const room = getRoomById(getRoomIdForAliasRes.room_id);
                if (room) setSelectedRoom(room);
                return;
            }
            const targetMatrixUserId = makeMatrixUserId(targetUserId);
            const [createRoomRes, createRoomErr] = await resolvePromise(
                matrixClient.createRoom({
                    is_direct: true,
                    preset: Preset.TrustedPrivateChat,
                    name: roomName,
                    room_alias_name: roomName,
                    invite: [targetMatrixUserId],
                })
            );

            if (createRoomErr || !createRoomRes) {
                console.log({ createRoomErr });
                throw new Error('Fail to create room');
            }

            const room = getRoomById(createRoomRes.room_id);
            if (room) setSelectedRoom(room);
        } catch (error: any) {
            console.log('create solo room', { error });
        }
    };

    const handleCreateGroupRoom = async (
        targetUserIds: Array<string> = ['gm.qtest2', 'gm.qtest5']
    ) => {
        try {
            if (!matrixClient) return;

            const matrixClientUserId = matrixClient.getUserId();
            if (!matrixClientUserId) return;

            const clientUserId = getUserId(matrixClientUserId);
            if (!clientUserId) return;

            const userIds = [clientUserId, ...targetUserIds];
            const roomName = makeRoomName(userIds);
            const roomAlias = makeRoomAlias(roomName);

            const [getRoomIdForAliasRes, getRoomIdForAliasErr] =
                await resolvePromise(matrixClient.getRoomIdForAlias(roomAlias));

            if (!getRoomIdForAliasErr && getRoomIdForAliasRes) {
                const room = getRoomById(getRoomIdForAliasRes.room_id);
                if (room) setSelectedRoom(room);
                return;
            }

            const [createRoomRes, createRoomErr] = await resolvePromise(
                matrixClient.createRoom({
                    is_direct: true,
                    preset: Preset.TrustedPrivateChat,
                    name: roomName,
                    room_alias_name: roomName,
                    invite: targetUserIds.map(makeMatrixUserId),
                })
            );

            if (createRoomErr || !createRoomRes) {
                throw new Error('Fail to create room');
            }

            const room = getRoomById(createRoomRes.room_id, 60000);
            if (room) setSelectedRoom(room);
        } catch (error: any) {
            console.log('create group room', { error });
        }
    };

    const getRoomById = (roomId: string, timeout: number = 30000) => {
        if (!matrixClient) throw new Error('MatrixClient is undefined');

        let room = null;
        let startTime = Date.now();

        do {
            room = matrixClient.getRoom(roomId);

            if (room) {
                break;
            }

            if (Date.now() - startTime > timeout) {
                throw new Error('Get room timeout');
            }
        } while (!room);

        return room;
    };

    return {
        matrixClient,
        handleStartMatrixClient,
        handleStopMatrixClient,
        handleCreateSoloRoom,
        handleCreateGroupRoom,
    };
};
