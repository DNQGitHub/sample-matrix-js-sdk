import React, { PropsWithChildren } from 'react';
import { useMatrixContext } from '../../../contexts';
import { EventStatus, MatrixEvent, Room } from 'matrix-js-sdk';

// -------------------------------------------

export type ChatBoxContextValue = {
    clientUserId?: string | null;
    room?: Room;
    events: Array<MatrixEvent>;

    shouldShowLatestEvent: boolean;

    handleSendTextMessage: (textMessage: string) => void;
    handleResendEvent: (event: MatrixEvent) => void;
    handleLoadPreviousEvents: () => void;
};

export const ChatBoxContext = React.createContext<ChatBoxContextValue>(
    {} as ChatBoxContextValue
);

export const useChatBoxContext = () => {
    const context = React.useContext(ChatBoxContext);

    if (!context) throw new Error('Miss wrapping with ChatBoxContext.Provider');

    return context;
};

// -------------------------------------------

export type ChatBoxProviderProps = PropsWithChildren<{}>;

export const ChatBoxProvider = ({ children }: ChatBoxProviderProps) => {
    const shouldShowLatestEventRef = React.useRef(true);
    const { matrixClient, selectedRoom } = useMatrixContext();

    const timelineEvents = React.useMemo(() => {
        return selectedRoom?.getLiveTimeline().getEvents() || [];
    }, [selectedRoom]);

    const pendingEvents = React.useMemo(() => {
        return selectedRoom?.getPendingEvents() || [];
    }, [selectedRoom]);

    const handleSendTextMessage = async (textMessage: string) => {
        if (!selectedRoom || !textMessage?.trim()) return;

        shouldShowLatestEventRef.current = true;
        matrixClient.sendTextMessage(selectedRoom.roomId, textMessage);
    };

    const handleResendEvent = (event: MatrixEvent) => {
        if (!selectedRoom) return;
        if (event.status !== EventStatus.NOT_SENT) return;

        matrixClient.resendEvent(event, selectedRoom);
    };

    const handleLoadPreviousEvents = () => {
        if (!selectedRoom) return;

        shouldShowLatestEventRef.current = false;
        matrixClient.scrollback(selectedRoom);
    };

    return (
        <ChatBoxContext.Provider
            value={{
                clientUserId: matrixClient?.getUserId(),
                room: selectedRoom,
                events: [...timelineEvents, ...pendingEvents],

                shouldShowLatestEvent: shouldShowLatestEventRef.current,

                handleSendTextMessage,
                handleResendEvent,
                handleLoadPreviousEvents,
            }}
        >
            {children}
        </ChatBoxContext.Provider>
    );
};
