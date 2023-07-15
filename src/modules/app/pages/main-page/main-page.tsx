import { Container, Flex, Stack } from '@mantine/core';
import { AuthBox, LoginForm } from '../../../auth/components';
import { RoomList } from '~/modules/chat/components';
import { useState } from 'react';
import { Room } from 'matrix-js-sdk';
import { ChatRoom } from '~/modules/chat/components/chat-room/chat-room';

export const MainPage = () => {
    const [currentRoom, setCurrentRoom] = useState<Room>();

    return (
        <Container>
            <Stack>
                <LoginForm />
                <AuthBox />

                <Flex gap={12} align={'stretch'}>
                    <RoomList
                        onRoomSelected={setCurrentRoom}
                        style={{ flex: 3 }}
                    />
                    <ChatRoom
                        roomId={currentRoom?.roomId}
                        style={{ flex: 4 }}
                    />
                </Flex>
            </Stack>
        </Container>
    );
};
