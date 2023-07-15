import { ScrollArea, Stack, Text } from '@mantine/core';
import { useRoomList } from './use-room-list';
import { useAuthContext } from '~/modules/auth/contexts/auth-context/auth-context';
import { RoomListContext } from './room-list-context';
import { useEffect } from 'react';
import { Room } from 'matrix-js-sdk';
import { RoomListItem } from './room-list-item';

export type RoomListProps = {
    style?: React.CSSProperties;
    onRoomSelected?: (room: Room) => void;
};

export const RoomList = ({ style, onRoomSelected }: RoomListProps) => {
    const { hasUserLogined } = useAuthContext();
    const { rooms, selectedRoom, setSelectedRoom } = useRoomList();

    useEffect(() => {
        if (selectedRoom) onRoomSelected?.(selectedRoom);
    }, [selectedRoom, onRoomSelected]);

    if (!hasUserLogined) {
        return null;
    }

    return (
        <RoomListContext.Provider
            value={{
                rooms,
                selectedRoom,
                setSelectedRoom,
            }}
        >
            <Stack
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    flex: 1,
                    ...style,
                }}
                p={20}
            >
                {!rooms?.length ? (
                    <Text>Empty</Text>
                ) : (
                    <ScrollArea mah={500}>
                        <Stack>
                            {rooms.map((room) => (
                                <RoomListItem key={room.roomId} room={room} />
                            ))}
                        </Stack>
                    </ScrollArea>
                )}
            </Stack>
        </RoomListContext.Provider>
    );
};
