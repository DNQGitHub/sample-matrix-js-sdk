import { Box, Container, Flex, Stack, Title } from '@mantine/core';
import { ActionBar } from './action-bar/action-bar';
import { RoomList } from './room-list/room-list';
import { ChatBox } from './chat-box/chat-box';
import { ChatBoxProvider } from './chat-box/chat-box-context';

export const MainPage = () => {
    return (
        <Box>
            <Container>
                <Stack>
                    <Title transform="uppercase">Main Page</Title>

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
