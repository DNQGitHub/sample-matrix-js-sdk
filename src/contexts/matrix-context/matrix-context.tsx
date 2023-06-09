import React, { PropsWithChildren } from 'react';
import MatrixSdk, {
    MatrixClient,
    ClientEvent,
    Room,
    ICreateClientOpts,
} from 'matrix-js-sdk';
import { ISyncStateData, SyncState } from 'matrix-js-sdk/lib/sync';

export type MatrixContextValue = {
    startMatrixClient: (opts: ICreateClientOpts) => void;
    matrixClient?: MatrixClient;
};

export type MatrixProviderProps = PropsWithChildren<{}>;

export const MatrixContext = React.createContext<MatrixContextValue>(
    {} as MatrixContextValue
);

export const MatrixProvider = ({ children }: MatrixProviderProps) => {
    const [matrixClient, setMatrixClient] = React.useState<MatrixClient>();

    React.useEffect(() => {
        return () => {
            if (matrixClient) matrixClient.removeAllListeners();
        };
    }, []);

    const startMatrixClient = (opts: ICreateClientOpts) => {
        const matrixClient = MatrixSdk.createClient(opts);

        matrixClient.addListener(
            ClientEvent.Sync,
            (
                state: SyncState,
                lastState: SyncState | null,
                data?: ISyncStateData
            ) => {
                console.log('sync-event', { state, lastState, data });
            }
        );

        matrixClient.addListener(ClientEvent.Room, (room: Room) => {
            console.log('room-event', { room });
        });

        matrixClient.startClient();

        setMatrixClient(matrixClient);
    };

    return (
        <MatrixContext.Provider
            value={{
                matrixClient,
                startMatrixClient,
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
