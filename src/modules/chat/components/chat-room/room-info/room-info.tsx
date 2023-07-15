import { Flex, Stack, Text } from '@mantine/core';
import { useChatRoomContext } from '../chat-room-context';

export const RoomInfo = () => {
    const { room } = useChatRoomContext();

    if (!room) {
        return null;
    }

    const roomMembers = room.getMembers().map((m) => m.userId);

    return (
        <Stack
            p={12}
            style={{
                gap: 4,
                border: '1px solid black',
                borderRadius: 8,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
            }}
        >
            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Creator:
                </Text>
                <Text>{room.getCreator()}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Version:
                </Text>
                <Text>{room.getVersion()}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room ID:
                </Text>
                <Text>{room.roomId}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Name:
                </Text>
                <Text>{room.name}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Alt Aliases:
                </Text>
                <Text>{JSON.stringify(room.getAltAliases(), null, 4)}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Canonical Alias:
                </Text>
                <Text>{room.getCanonicalAlias()}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Avatar Url:
                </Text>
                <Text>{room.getMxcAvatarUrl()}</Text>
            </Flex>

            <Flex gap={8}>
                <Text component="b" miw={200}>
                    Room Members:
                </Text>
                <Text>{JSON.stringify(roomMembers, null, 4)}</Text>
            </Flex>
        </Stack>
    );
};
