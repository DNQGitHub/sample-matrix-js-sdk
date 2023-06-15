import { Box, Stack, Text } from '@mantine/core';
import { useChatBox } from './use-chat-box';
import { getUserId } from '../../../utils';
import dayjs from 'dayjs';
import { MessageComposer } from './message-composer/message-composer';

export const ChatBox = () => {
    const { clientUserId, room, timelineEvents } = useChatBox();

    return (
        <Stack p={10} style={{ border: '1px solid black', borderRadius: 8 }}>
            <Text fw={700} size={20} transform="uppercase" underline>
                {room?.name}
            </Text>

            <Box
                p={10}
                h={400}
                mah={400}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    overflowY: 'scroll',
                }}
            >
                <Stack>
                    {timelineEvents?.map((e) => {
                        const isSelf = e.sender?.userId === clientUserId;

                        return (
                            <Box
                                px={12}
                                py={4}
                                style={{
                                    maxWidth: '70%',
                                    marginLeft: isSelf ? 'auto' : undefined,
                                    marginRight: !isSelf ? 'auto' : undefined,
                                    border: `2px solid ${
                                        isSelf ? '#eaab00' : '#0098db'
                                    }`,
                                    borderRadius: 4,
                                }}
                            >
                                <Text
                                    fw={500}
                                    size={20}
                                    underline
                                    ta={isSelf ? 'right' : 'left'}
                                >
                                    {getUserId(e.sender?.userId)}
                                    {' | '}
                                    {dayjs(e.event.origin_server_ts).format(
                                        'YYYY-MM-DD | hh:mm:ss'
                                    )}
                                </Text>

                                <Text
                                    ta={isSelf ? 'right' : 'left'}
                                    style={{ wordBreak: 'break-all' }}
                                >
                                    {JSON.stringify(e.event.content)}
                                </Text>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>

            <MessageComposer />
        </Stack>
    );
};
