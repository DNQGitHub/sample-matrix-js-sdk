export function makeRoomName(chatGmUserIds: Array<string>) {
    return chatGmUserIds.sort().join('_');
}

export function makeRoomAlias(roomName: string) {
    return `#${roomName}:matrix.tauhu.cloud`;
}

export function transformToMatrixUserId(chatGmUserId: string) {
    return `@${chatGmUserId}:matrix.tauhu.cloud`;
}

export function transformToChatGmUserId(matrixUserId?: string) {
    if (!matrixUserId) return null;

    return matrixUserId.replace('@', '').split(':')[0];
}
