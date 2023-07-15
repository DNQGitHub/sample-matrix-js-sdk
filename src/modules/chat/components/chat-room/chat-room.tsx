import { Box, Stack, Text } from '@mantine/core';
import { useChatRoom } from './use-chat-room';
import { ChatRoomContext } from './chat-room-context';
import { EventList } from './event-list/event-list';
import { RoomInfo } from './room-info/room-info';

export type ChatRoomProps = {
    roomId?: string;
    style?: React.CSSProperties;
};

export const ChatRoom = ({ roomId, style }: ChatRoomProps) => {
    const { room, events, eventReadUpToId, initializeHandler } = useChatRoom({
        roomId,
    });

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

    if (!room) {
        return null;
    }

    return (
        <ChatRoomContext.Provider
            value={{
                room,
                events,
                eventReadUpToId,
            }}
        >
            <Stack
                p={20}
                // mah={500}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    flex: 1,
                    ...style,
                }}
            >
                <RoomInfo />
                <EventList />
            </Stack>
        </ChatRoomContext.Provider>
    );
};
