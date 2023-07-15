import { EventType, MatrixEvent, MsgType } from 'matrix-js-sdk';

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
    if (!matrixUserId) return '';

    return matrixUserId.replace('@', '').split(':')[0];
}

export function briefEvent(event?: MatrixEvent) {
    const type = event?.getType();
    const content = event?.getContent();
    const sender = transformToChatGmUserId(event?.getSender());

    switch (type) {
        case EventType.RoomMessage:
            switch (content?.msgtype) {
                case MsgType.Text: {
                    const body: string = content.body;
                    const shortenBody =
                        body.length < 30 ? body : `${body.slice(0, 30)}...`;
                    return `${sender}: ${shortenBody}`;
                }
                case MsgType.Emote:
                    return `${sender} sent a emotion`;
                case MsgType.File:
                    return `${sender} sent a file`;
                case MsgType.Audio:
                    return `${sender} sent a audio`;
                case MsgType.Image:
                    return `${sender} sent a image`;
                case MsgType.Video:
                    return `${sender} sent a video`;
                case MsgType.Location:
                    return `${sender} sent a location`;
                case MsgType.Notice:
                    return `${sender} sent a notice`;
                case MsgType.KeyVerificationRequest:
                    return `${sender} sent a verification request`;
                default:
                    return '';
            }

        case EventType.RoomMember: {
            switch (content?.membership) {
                case 'join':
                    return `${sender} joined`;
                case 'invite':
                    return `${sender} has been invited`;
                case 'leave':
                    return `${sender} has left`;

                default:
                    return '';
            }
        }

        case EventType.Reaction:
            return `${sender} react a message`;

        case EventType.Sticker:
            return `${sender} sent a sticker`;

        default:
            return '[Another event type]';
    }
}
