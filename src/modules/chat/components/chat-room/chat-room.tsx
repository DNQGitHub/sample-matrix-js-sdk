import { Box, Stack, Text } from '@mantine/core';
import { useChatRoom } from './use-chat-room';
import { ChatRoomContext } from './chat-room-context';
import { EventList as MessageList } from './event-list/event-list';
import { RoomInfo } from './room-info/room-info';
import { MessageInput } from './message-input/message-input';
import { MembershipInfo } from './membership-info/membership-info';

export type ChatRoomProps = {
    roomId?: string;
    style?: React.CSSProperties;
};

export const ChatRoom = ({ roomId, style }: ChatRoomProps) => {
    const { room, events, eventReadUpTo, initializeHandler, scrollBack } =
        useChatRoom({
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
                eventReadUpTo,
                scrollBack,
            }}
        >
            <Stack
                p={20}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    flex: 1,
                    ...style,
                }}
            >
                <RoomInfo />
                <MessageList />
                <MessageInput />
                <MembershipInfo />
            </Stack>
        </ChatRoomContext.Provider>
    );
};
