import { Text, UnstyledButton } from '@mantine/core';
import { Room } from 'matrix-js-sdk';
import { useRoomListContext } from './room-list-context';

export type RoomListItemProps = {
    room: Room;
};

export const RoomListItem = ({ room }: RoomListItemProps) => {
    const { selectedRoom, setSelectedRoom } = useRoomListContext();
    const isSelected = selectedRoom === room;

    return (
        <UnstyledButton
            style={{
                border: `2px solid ${isSelected ? '#f0a24f' : 'black'}`,
                borderRadius: 8,
            }}
            px={16}
            py={8}
            onClick={() => setSelectedRoom(room)}
        >
            <Text>{room.roomId}</Text>
            <Text>{room.name}</Text>
            <Text>{room.normalizedName}</Text>
        </UnstyledButton>
    );
};
