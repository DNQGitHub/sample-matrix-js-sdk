import { MatrixEvent, Room } from 'matrix-js-sdk';
import { createContext, useContext } from 'react';

export type ChatRoomContextValue = {
    room?: Room;
    events: MatrixEvent[];
};

export const ChatRoomContext = createContext<ChatRoomContextValue>(
    {} as ChatRoomContextValue
);

export const useChatRoomContext = () => {
    const context = useContext(ChatRoomContext);

    if (!context)
        throw new Error('Miss wrapping with ChatRoomContext.Provider');

    return context;
};
