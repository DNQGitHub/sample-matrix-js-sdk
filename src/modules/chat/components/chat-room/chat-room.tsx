import { Box, Stack, Text } from '@mantine/core';
import { useChatRoom } from './use-chat-room';
import { ChatRoomContext } from './chat-room-context';
import { EventList } from './event-list/event-list';

export type ChatRoomProps = {
    roomId?: string;
    style?: React.CSSProperties;
};

export const ChatRoom = ({ roomId, style }: ChatRoomProps) => {
    const { room, events, initializeHandler } = useChatRoom({ roomId });

    if (!roomId) {
        return null;
    }

    if (initializeHandler.isIdle || initializeHandler.isLoading) {
        return (
            <Box
                px={16}
                py={8}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    flex: 1,
                    ...style,
                }}
            >
                <Text>Loading...</Text>
            </Box>
        );
    }

    return (
        <ChatRoomContext.Provider
            value={{
                room,
                events,
            }}
        >
            <Stack
                p={20}
                mah={500}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    flex: 1,
                    ...style,
                }}
            >
                <EventList />
            </Stack>
        </ChatRoomContext.Provider>
    );
};
