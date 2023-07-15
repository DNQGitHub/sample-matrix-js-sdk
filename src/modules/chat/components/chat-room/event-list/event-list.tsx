import { Box, ScrollArea, Stack, Text } from '@mantine/core';
import { useChatRoomContext } from '../chat-room-context';

export const EventList = () => {
    const { events } = useChatRoomContext();

    return (
        <ScrollArea
            p={20}
            h={500}
            style={{
                border: '1px solid black',
                borderRadius: 8,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
            }}
        >
            <Stack>
                {events.map((e) => (
                    <Box>
                        <Text
                            component="pre"
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}
                        >
                            {JSON.stringify(e.getContent(), null, 4)}
                        </Text>
                    </Box>
                ))}
            </Stack>
        </ScrollArea>
    );
};
