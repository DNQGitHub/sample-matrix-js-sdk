import { Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import { Room } from 'matrix-js-sdk';
import dayjs from 'dayjs';
import { useRoomListContext } from './room-list-context';
import { briefEvent } from '~/modules/matrix/utils';

export type RoomListItemProps = {
    room: Room;
};

export const RoomListItem = ({ room }: RoomListItemProps) => {
    const { selectedRoom, setSelectedRoom } = useRoomListContext();

    const isSelected = selectedRoom === room;
    const unreadCount = room.getUnreadNotificationCount();
    const latestEventTs = room.getLastActiveTimestamp();
    const roomName =
        room.getAltAliases()?.[0] || room.name || room.getCanonicalAlias();
    const latestEvent = room.getLastLiveEvent();

    return (
        <UnstyledButton
            style={{
                border: `2px solid ${isSelected ? '#fa9c4a' : '#dedede'}`,
                borderRadius: 8,
                boxShadow: isSelected
                    ? 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px'
                    : undefined,
            }}
            px={16}
            py={8}
            onClick={() => setSelectedRoom(room)}
        >
            <Flex gap={8}>
                <Stack style={{ gap: 1, wordBreak: 'break-all' }}>
                    <Text component="b">{roomName}</Text>
                    <Text component="i">{room.roomId}</Text>
                    <Text>{''.padEnd(20, '-')}</Text>
                    <Text>{briefEvent(latestEvent)}</Text>
                </Stack>
                <Stack
                    style={{ flex: 1, gap: 1 }}
                    align="flex-end"
                    justify="space-between"
                    miw={120}
                >
                    <Text
                        align="right"
                        component={unreadCount > 0 ? 'b' : 'div'}
                        size={20}
                    >
                        {unreadCount ? `(${unreadCount})` : ''}
                    </Text>
                    <Text align="right">
                        {dayjs(latestEventTs).fromNow(false)}
                    </Text>
                </Stack>
            </Flex>
        </UnstyledButton>
    );
};
