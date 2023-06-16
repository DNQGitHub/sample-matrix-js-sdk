import React, { PropsWithChildren } from 'react';
import MatrixSdk, {
    MatrixClient,
    ClientEvent,
    Room,
    ICreateClientOpts,
    RoomEvent,
    MatrixEvent,
    PendingEventOrdering,
} from 'matrix-js-sdk';
import { ISyncStateData, SyncState } from 'matrix-js-sdk/lib/sync';

export type MatrixContextValue = {
    matrixClient?: MatrixClient;
    rooms: Array<Room>;
    selectedRoom?: Room;
    startMatrixClient: (opts: ICreateClientOpts) => void;
    stopMatrixClient: () => void;
    setSelectedRoom: (room: Room) => void;
};

export type MatrixProviderProps = PropsWithChildren<{}>;

export const MatrixContext = React.createContext<MatrixContextValue>(
    {} as MatrixContextValue
);

export const MatrixProvider = ({ children }: MatrixProviderProps) => {
    const [matrixClient, setMatrixClient] = React.useState<MatrixClient>();
    const [rooms, setRooms] = React.useState<Array<Room>>([]);
    const [selectedRoom, setSelectedRoom] = React.useState<Room>();

    const startMatrixClient = (opts: ICreateClientOpts) => {
        const matrixClient = MatrixSdk.createClient(opts);

        matrixClient.once(
            ClientEvent.Sync,
            (
                state: SyncState,
                lastState: SyncState | null,
                data?: ISyncStateData
            ) => {
                console.log('sync-event', { state, lastState, data });

                if (state !== SyncState.Prepared) return;

                setMatrixClient(matrixClient);
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

    const stopMatrixClient = () => {
        if (!matrixClient) return;

        matrixClient.removeAllListeners();
        matrixClient.stopClient();
        setSelectedRoom(undefined);
        setRooms([]);
        setMatrixClient(undefined);
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

export const useMatrixContext = () => {
    const context = React.useContext(MatrixContext);

    if (!context) throw new Error('Miss wrapping with MatrixContext.Provider');

    return context;
};
