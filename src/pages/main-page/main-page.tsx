import { Box, Container, Flex, Stack, Title } from '@mantine/core';
import { ActionBar } from './action-bar/action-bar';
import { RoomList } from './room-list/room-list';
import { ChatBox } from './chat-box/chat-box';
import { ChatBoxProvider } from './chat-box/chat-box-context';
import { LoginForm } from './login-form/login-form';
import { AuthInfo } from './auth-info';

export const MainPage = () => {
    return (
        <Box>
            <Container>
                <Stack>
                    <Title transform="uppercase">Main Page</Title>

                    <LoginForm />

                    <AuthInfo />

                    <ActionBar />

                    <Flex w={'100%'} gap={8}>
                        <Box style={{ flex: 2 }}>
                            <RoomList />
                        </Box>

                        <Box style={{ flex: 3 }}>
                            <ChatBoxProvider>
                                <ChatBox />
                            </ChatBoxProvider>
                        </Box>
                    </Flex>
                </Stack>
            </Container>
        </Box>
    );
};
