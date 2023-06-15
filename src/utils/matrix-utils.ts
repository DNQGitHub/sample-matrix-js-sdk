export function makeRoomName(userIds: Array<string>) {
    return userIds.sort().join('_');
}

export function makeRoomAlias(roomName: string) {
    return `#${roomName}:matrix.tauhu.cloud`;
}

export function makeMatrixUserId(userId: string) {
    return `@${userId}:matrix.tauhu.cloud`;
}

export function getUserId(matrixUserId?: string) {
    if (!matrixUserId) return null;

    return matrixUserId.replace('@', '').split(':')[0];
}
