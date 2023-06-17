import React, { PropsWithChildren } from 'react';
import {
    ClientEvent,
    Room,
    RoomEvent,
    MatrixEvent,
    PendingEventOrdering,
} from 'matrix-js-sdk';
import { ISyncStateData, SyncState } from 'matrix-js-sdk/lib/sync';
import { MatrixService } from '../../services';
import { useAuthStore } from '../../services/auth-service/auth-store';

// -------------------------------------------------

export type MatrixContextValue = {
    matrixClient: MatrixService;
    rooms: Array<Room>;
    selectedRoom?: Room;
    startMatrixClient: () => void;
    stopMatrixClient: () => void;
    setSelectedRoom: (room: Room) => void;
};

export const MatrixContext = React.createContext<MatrixContextValue>(
    {} as MatrixContextValue
);

export const useMatrixContext = () => {
    const context = React.useContext(MatrixContext);

    if (!context) throw new Error('Miss wrapping with MatrixContext.Provider');

    return context;
};

// -------------------------------------------------

export type MatrixProviderProps = PropsWithChildren<{}>;

const BASE_URL = 'https://matrix.tauhu.cloud';

const matrixClient = MatrixService.createClient({
    baseUrl: BASE_URL,
    userId: useAuthStore.getState().authMatrixUser?.userId,
    accessToken: useAuthStore.getState().authMatrixUser?.accessToken,
});

export const MatrixProvider = ({ children }: MatrixProviderProps) => {
    const [rooms, setRooms] = React.useState<Array<Room>>([]);
    const [selectedRoom, setSelectedRoom] = React.useState<Room>();

    const startMatrixClient = async () => {
        if (matrixClient.clientRunning) return;

        matrixClient.once(
            ClientEvent.Sync,
            (
                state: SyncState,
                lastState: SyncState | null,
                data?: ISyncStateData
            ) => {
                console.log('sync-event', { state, lastState, data });

                if (state !== SyncState.Prepared) return;
                console.log({ aaaa: matrixClient.getRooms() });
                setRooms(matrixClient.getRooms());
            }
        );

        matrixClient.on(
            RoomEvent.Timeline,
            (event: MatrixEvent, room?: Room, toStartOfTimeline?: boolean) => {
                console.log('room-timeline-event --->', {
                    event,
                    room,
                    toStartOfTimeline,
                });

                const rooms = matrixClient.getRooms();
                setRooms(rooms);
            }
        );

        matrixClient.on(
            RoomEvent.LocalEchoUpdated,
            (event, room, oldEventId, oldStatus) => {
                console.log('local-echo-updated-event --->', {
                    event,
                    room,
                    oldEventId,
                    oldStatus,
                });

                const rooms = matrixClient.getRooms();
                setRooms(rooms);
            }
        );

        matrixClient.startClient({
            pendingEventOrdering: PendingEventOrdering.Detached,
        });
    };

    const stopMatrixClient = async () => {
        if (!matrixClient.clientRunning) return;

        matrixClient.removeAllListeners();
        matrixClient.stopClient();
        setSelectedRoom(undefined);
        setRooms([]);
    };

    return (
        <MatrixContext.Provider
            value={{
                matrixClient,
                rooms,
                selectedRoom,
                startMatrixClient,
                stopMatrixClient,
                setSelectedRoom,
            }}
        >
            {children}
        </MatrixContext.Provider>
    );
};
