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

                <Flex gap={12}>
                    <RoomList onRoomSelected={setCurrentRoom} />
                    <ChatRoom
                        roomId={currentRoom?.roomId}
                        style={{ flex: 2 }}
                    />
                </Flex>
            </Stack>
        </Container>
    );
};
