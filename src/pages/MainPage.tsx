import React, { MouseEventHandler } from 'react';
import { Box, Button, Container, Flex, Text, Title } from '@mantine/core';
import { useMatrixContext } from '../contexts';
import dayJs from 'dayjs';
import { MatrixEvent, RoomEvent } from 'matrix-js-sdk';

/**
 * @home_server https://matrix.tauhu.cloud
 * @user_id @gm.qtest1:matrix.tauhu.cloud
 * @access_token syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs
 */

export const MainPage = () => {
    const { matrixClient, startMatrixClient, stopMatrixClient } =
        useMatrixContext();

    const onButtonStartClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> start button clicked');

        startMatrixClient({
            baseUrl: 'https://matrix.tauhu.cloud',
            userId: '@gm.qtest1:matrix.tauhu.cloud',
            accessToken: 'syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs',
        });
    };

    const onButtonStopClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> stop button clicked');

        stopMatrixClient();
    };

    return (
        <Box>
            <Container>
                <Title>Main Page</Title>

                <Button
                    onClick={
                        matrixClient
                            ? onButtonStopClicked
                            : onButtonStartClicked
                    }
                >
                    {matrixClient
                        ? `Stop - ${matrixClient?.getUserId()?.split(':')?.[0]}`
                        : 'Start'}
                </Button>

                <Flex gap={10} mt={20}>
                    <ListRooms />
                    <SelectedRoom />
                </Flex>
            </Container>
        </Box>
    );
};

const ListRooms = () => {
    const { rooms, setSelectedRoom } = useMatrixContext();

    return (
        <Flex direction="column" gap={5}>
            {rooms.map((r) => (
                <Button key={r.roomId} onClick={() => setSelectedRoom(r)}>
                    <Text>
                        {r.name} - ({r.roomId})
                    </Text>
                </Button>
            ))}
        </Flex>
    );
};

const SelectedRoom = () => {
    const { selectedRoom, matrixClient } = useMatrixContext();
    const [roomEvents, setRoomEvents] = React.useState<Array<MatrixEvent>>([]);

    React.useEffect(() => {
        (async () => {
            if (!selectedRoom) {
                setRoomEvents([]);
                return;
            }

            const response = await fetch(
                `${matrixClient?.baseUrl}/_matrix/client/v3/rooms/${selectedRoom.roomId}/messages?dir=b&from=t1-38_0_0_0_0_0_0_0_0_0`,
                {
                    headers: {
                        Authorization:
                            'Bearer syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs',
                    },
                }
            );
            const responseJson = await response.json();

            console.log('selected ---->', { responseJson });
        })();
    }, [selectedRoom]);

    if (!selectedRoom) {
        return <Text>No room selected</Text>;
    }

    return (
        <Flex
            direction="column"
            gap={5}
            p={10}
            style={{ flex: 1, border: '1px solid black', borderRadius: 8 }}
        >
            {selectedRoom.timeline.map((t) => (
                <Flex key={t.getId()} direction="column">
                    <Text>
                        [{t.event.sender?.split(':')?.[0]}] |{' '}
                        {dayJs(t.event.origin_server_ts).format('YYYY-MM-DD')}:{' '}
                    </Text>
                    <Text ml={20}>
                        {JSON.stringify(t.event.content, null, 4)}
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
};
