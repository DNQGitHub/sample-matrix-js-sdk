import { createContext, useContext } from 'react';

export type MessageInputContextValue = {
    sendTextMessage: (text: string) => Promise<void>;
};

export const MessageInputContext = createContext<MessageInputContextValue>(
    {} as MessageInputContextValue
);

export const useMessageInputContext = () => {
    const context = useContext(MessageInputContext);

    if (!context)
        throw new Error('Miss wrapping with MessageInputContext.Provider');

    return context;
};
