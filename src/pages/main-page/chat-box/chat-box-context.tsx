import React, { PropsWithChildren } from 'react';
import { EventStatus, MatrixEvent, Room } from 'matrix-js-sdk';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';
import { Reactions } from '~/services/matrix-service/dtos';

// -------------------------------------------

export type ChatBoxContextValue = {
    room?: Room;
    events: Array<MatrixEvent>;
    shouldShowLatestEvent: boolean;
    handleSendTextMessage: (textMessage: string) => Promise<void>;
    handleLoadPreviousEvents: () => Promise<void>;
    handleResendEvent: (event: MatrixEvent) => Promise<void>;
    handleReactEvent: (
        event: MatrixEvent,
        reaction: Reactions
    ) => Promise<void>;
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
        await matrixClient.sendTextMessage(selectedRoom.roomId, textMessage);
    };

    const handleLoadPreviousEvents = async () => {
        if (!selectedRoom) return;

        shouldShowLatestEventRef.current = false;
        await matrixClient.scrollback(selectedRoom);
    };

    const handleResendEvent = async (event: MatrixEvent) => {
        if (!selectedRoom) return;
        if (event.status !== EventStatus.NOT_SENT) return;

        shouldShowLatestEventRef.current = false;
        await matrixClient.resendEvent(event, selectedRoom);
    };

    const handleReactEvent = async (
        event: MatrixEvent,
        reaction: Reactions
    ) => {
        if (!selectedRoom) return;

        shouldShowLatestEventRef.current = false;
        await matrixClient.sendReaction(selectedRoom, event, reaction);
    };

    return (
        <ChatBoxContext.Provider
            value={{
                room: selectedRoom,
                events: [...timelineEvents, ...pendingEvents],

                shouldShowLatestEvent: shouldShowLatestEventRef.current,

                handleSendTextMessage,
                handleLoadPreviousEvents,
                handleResendEvent,
                handleReactEvent,
            }}
        >
            {children}
        </ChatBoxContext.Provider>
    );
};
