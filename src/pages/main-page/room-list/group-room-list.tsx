import React from 'react';
import dayjs from 'dayjs';
import { UnstyledButton, Stack, Text } from '@mantine/core';
import { transformToChatGmUserId } from '../../../services/matrix-service/utils';
import { useMatrixContext } from '../../../services/matrix-service/matrix-context';

export const GroupRoomList = () => {
    const { rooms, selectedRoom, setSelectedRoom } = useMatrixContext();

    const filterRooms = React.useMemo(() => {
        return rooms.filter((r) => r.name.split('_').length > 2);
    }, [rooms]);

    return (
        <Stack>
            {filterRooms.map((r) => {
                const latestEvent = r.getLastLiveEvent();
                const isSelectedRoom = r.roomId === selectedRoom?.roomId;

                return (
                    <UnstyledButton
                        key={r.roomId}
                        p={12}
                        style={{
                            borderRadius: 8,
                            backgroundColor: isSelectedRoom
                                ? '#dedede'
                                : undefined,
                        }}
                        onClick={() => setSelectedRoom(r)}
                    >
                        <Text fw={700}>[ {r.name} ]</Text>

                        <Text underline>
                            {transformToChatGmUserId(
                                latestEvent?.sender?.userId
                            )}
                            {' | '}
                            {dayjs(
                                latestEvent?.event.origin_server_ts
                            ).fromNow()}
                        </Text>

                        <Text
                            style={{
                                wordBreak: 'break-all',
                                wordWrap: 'break-word',
                                // @ts-ignore
                                textWrap: 'wrap',
                            }}
                        >
                            {JSON.stringify(latestEvent?.event.content)}
                        </Text>
                    </UnstyledButton>
                );
            })}
        </Stack>
    );
};
