import { EventType } from 'matrix-js-sdk';

export const DEFAULT_HOME_SERVER = 'https://matrix.tauhu.cloud';

export const ALLOW_VISIBLE_EVENT_TYPES = [
    EventType.RoomMessage.toString(),
    EventType.Sticker.toString(),
];
