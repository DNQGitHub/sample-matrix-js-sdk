import React from 'react';
import dayjs from 'dayjs';
import { UnstyledButton, Stack, Text } from '@mantine/core';
import { useMatrixContext } from '../../../contexts';
import { getUserId } from '../../../utils';

export const SoloRoomList = () => {
    const { rooms, selectedRoom, setSelectedRoom } = useMatrixContext();

    const filterRooms = React.useMemo(() => {
        return rooms.filter((r) => r.name.split('_').length === 2);
    }, [rooms]);

    return (
        <Stack>
            {filterRooms.map((r) => {
                const latestEvent = r.getLastLiveEvent();
                const isSelectedRoom = r.roomId === selectedRoom?.roomId;

                return (
                    <UnstyledButton
                        p={12}
                        style={{
                            borderRadius: 8,
                            border: isSelectedRoom
                                ? '1px solid black'
                                : undefined,
                        }}
                        onClick={() => setSelectedRoom(r)}
                    >
                        <Text fw={700}>[ {r.name} ]</Text>

                        <Text underline>
                            {getUserId(latestEvent?.sender?.userId)}
                            {' | '}
                            {dayjs(
                                latestEvent?.event.origin_server_ts
                            ).fromNow()}
                        </Text>

                        <Text>
                            {JSON.stringify(latestEvent?.event.content)}
                        </Text>
                    </UnstyledButton>
                );
            })}
        </Stack>
    );
};
