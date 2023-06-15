import React, { MouseEventHandler } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useMatrixContext } from '../contexts';
import dayJs from 'dayjs';
import { MatrixEvent, Preset } from 'matrix-js-sdk';
import { resolvePromise } from '../utils';

/**
 * @home_server https://matrix.tauhu.cloud
 * @user_id @gm.qtest1:matrix.tauhu.cloud
 * @access_token syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs
 */

export const MainPage = () => {
    const {
        matrixClient,
        selectedRoom,
        startMatrixClient,
        stopMatrixClient,
        setSelectedRoom,
    } = useMatrixContext();

    const onButtonStartClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> start button clicked');

        startMatrixClient({
            baseUrl: 'https://matrix.tauhu.cloud',
            userId: '@gm.qtest1:matrix.tauhu.cloud',
            accessToken: 'syt_Z20ucXRlc3Qx_pSAbqeJzXYiXLAbiAKUy_1UWIWe',
        });
    };

    const onButtonStopClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> stop button clicked');

        stopMatrixClient();
    };

    const onButtonCreateRoomClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> create room button clicked');

        try {
            if (!matrixClient) return;

            const userIds = ['gm.qtest1', 'gm.qtest4'];

            const roomName = userIds.sort().join('_');

            const roomAlias = `#${roomName}:matrix.tauhu.cloud`;

            const [getRoomIdForAliasRes, getRoomIdForAliasErr] =
                await resolvePromise(matrixClient.getRoomIdForAlias(roomAlias));

            if (!getRoomIdForAliasErr && getRoomIdForAliasRes) {
                console.log('create room', {
                    roomId: getRoomIdForAliasRes.room_id,
                });

                return;
            }

            const [createRoomRes, createRoomErr] = await resolvePromise(
                matrixClient.createRoom({
                    is_direct: true,
                    preset: Preset.TrustedPrivateChat,
                    name: roomName,
                    room_alias_name: roomName,
                    invite: [`@${userIds[1]}:matrix.tauhu.cloud`],
                })
            );

            console.log({ createRoomRes, createRoomErr });

            if (createRoomErr || !createRoomRes) {
                throw new Error(createRoomErr);
            }

            console.log('create room', {
                roomId: createRoomRes.room_id,
            });

            let newRoom = null;
            do {
                newRoom = matrixClient.getRoom(createRoomRes.room_id);
                console.log('--->', { newRoom });

                if (newRoom) {
                    setSelectedRoom(newRoom);
                    break;
                }
            } while (!newRoom);
        } catch (error: any) {
            console.log('create room', { error });
        }
    };

    const onButtonCreateGroupRoomClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> create group room button clicked');

        try {
            if (!matrixClient) return;

            const userIds = ['gm.qtest1', 'gm.qtest2', 'gm.qtest4'];

            const roomName = userIds.sort().join('_');

            const roomAlias = `#${roomName}:matrix.tauhu.cloud`;

            const [getRoomIdForAliasRes, getRoomIdForAliasErr] =
                await resolvePromise(matrixClient.getRoomIdForAlias(roomAlias));

            if (!getRoomIdForAliasErr && getRoomIdForAliasRes) {
                console.log('create room', {
                    roomId: getRoomIdForAliasRes.room_id,
                });

                return;
            }

            const [createRoomRes, createRoomErr] = await resolvePromise(
                matrixClient.createRoom({
                    is_direct: true,
                    preset: Preset.TrustedPrivateChat,
                    name: roomName,
                    room_alias_name: roomName,
                    invite: userIds
                        .filter((userId) => userId != userIds[0])
                        .map((userId) => `@${userId}:matrix.tauhu.cloud`),
                })
            );

            console.log({ createRoomRes, createRoomErr });

            if (createRoomErr || !createRoomRes) {
                throw new Error(createRoomErr);
            }

            console.log('create room', {
                roomId: createRoomRes.room_id,
            });

            let newRoom = null;
            do {
                newRoom = matrixClient.getRoom(createRoomRes.room_id);
                console.log('--->', { newRoom });

                if (newRoom) {
                    setSelectedRoom(newRoom);
                    break;
                }
            } while (!newRoom);
        } catch (error: any) {
            console.log('create room', { error });
        }
    };

    return (
        <Box>
            <Container>
                <Title mb={20}>Main Page</Title>

                <Flex gap={10}>
                    <Button
                        onClick={
                            matrixClient
                                ? onButtonStopClicked
                                : onButtonStartClicked
                        }
                    >
                        {matrixClient
                            ? `Stop - ${
                                  matrixClient?.getUserId()?.split(':')?.[0]
                              }`
                            : 'Start'}
                    </Button>

                    <Button
                        disabled={!!!matrixClient}
                        onClick={onButtonCreateRoomClicked}
                    >
                        Create Room
                    </Button>

                    <Button
                        disabled={!!!matrixClient}
                        onClick={onButtonCreateGroupRoomClicked}
                    >
                        Create Group Room
                    </Button>
                </Flex>

                <Flex gap={10} mt={20} align="flex-start">
                    <Box
                        p={10}
                        style={{
                            border: '1px solid black',
                            borderRadius: 8,
                        }}
                    >
                        <Text fw={700} mb={10}>
                            ROOMS
                        </Text>
                        <ListRooms />
                    </Box>

                    <Flex
                        direction="column"
                        gap={15}
                        p={10}
                        style={{
                            border: '1px solid black',
                            borderRadius: 8,
                        }}
                    >
                        <Text fw={700}>
                            SELECTED ROOM - {selectedRoom?.name} - ({' '}
                            {selectedRoom?.roomId} )
                        </Text>

                        <SelectedRoom />

                        <MessageComposer />
                    </Flex>
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
                        {r.name} - ( {r.roomId} )
                    </Text>
                </Button>
            ))}
        </Flex>
    );
};

const SelectedRoom = () => {
    const { selectedRoom } = useMatrixContext();

    if (!selectedRoom) {
        return <Text>No room selected</Text>;
    }

    return (
        <Box
            mah={500}
            style={{
                overflowY: 'scroll',
                border: '1px solid black',
                borderRadius: 8,
            }}
        >
            <Flex direction="column" gap={15} p={10}>
                {selectedRoom.timeline.map((t) => (
                    <Flex key={t.getId()} direction="column">
                        <Text>
                            [{t.event.sender?.split(':')?.[0]}] |{' '}
                            {dayJs(t.event.origin_server_ts).format(
                                'YYYY-MM-DD'
                            )}
                            :{' '}
                        </Text>
                        <Text ml={20}>
                            {JSON.stringify(t.event.content, null, 4)}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};

const MessageComposer = () => {
    const { matrixClient, selectedRoom } = useMatrixContext();

    if (!matrixClient || !selectedRoom) {
        return null;
    }

    const textInputRef: React.Ref<HTMLInputElement> | undefined =
        React.useRef<any>();

    const onButtonSendClicked: MouseEventHandler<HTMLButtonElement> = async (
        e
    ) => {
        console.log('---> send button clicked');

        const message = textInputRef.current?.value;
        console.log({ message });

        if (!message) return;

        const [sendMessageRes, sendMessageErr] = await resolvePromise(
            matrixClient.sendTextMessage(selectedRoom.roomId, message)
        );

        console.log({ sendMessageRes, sendMessageErr });
    };

    return (
        <Flex gap={10}>
            <TextInput ref={textInputRef} style={{ flex: 1 }} />
            <Button onClick={onButtonSendClicked}>Send</Button>
        </Flex>
    );
};
