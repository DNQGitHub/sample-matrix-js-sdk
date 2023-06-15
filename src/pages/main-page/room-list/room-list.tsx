import { Stack, Text } from '@mantine/core';
import { SoloRoomList } from './solo-room-list';
import { GroupRoomList } from './group-room-list';

export const RoomList = () => {
    return (
        <Stack p={16} style={{ border: '1px solid black', borderRadius: 8 }}>
            <Stack>
                <Text fw={700} size={20} transform="uppercase" underline>
                    Solo Rooms
                </Text>

                <SoloRoomList />
            </Stack>

            <Stack>
                <Text fw={700} size={20} transform="uppercase" underline>
                    Group Rooms
                </Text>

                <GroupRoomList />
            </Stack>
        </Stack>
    );
};
