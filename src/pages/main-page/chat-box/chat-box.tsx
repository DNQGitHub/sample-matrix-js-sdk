import { Box, Button, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { MessageComposer } from './message-composer';
import React from 'react';
import { useChatBoxContext } from './chat-box-context';
import { transformToChatGmUserId } from '~/services/matrix-service/utils';

export const ChatBox = () => {
    const boxRef: React.RefObject<HTMLDivElement> = React.useRef<any>(null);
    const {
        clientUserId,
        room,
        events,
        shouldShowLatestEvent,
        handleResendEvent,
        handleLoadPreviousEvents,
    } = useChatBoxContext();

    React.useEffect(() => {
        if (!boxRef.current || !shouldShowLatestEvent) return;

        boxRef.current?.scrollTo({
            behavior: 'smooth',
            top: boxRef.current.scrollHeight,
        });
    }, [events]);

    return (
        <Stack p={10} style={{ border: '1px solid black', borderRadius: 8 }}>
            <Text fw={700} size={20} transform="uppercase" underline>
                {room?.name}
            </Text>

            <Box
                ref={boxRef}
                p={10}
                h={500}
                mah={500}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                    overflowY: 'scroll',
                }}
            >
                <Stack>
                    {room && (
                        <Button onClick={handleLoadPreviousEvents}>
                            Load Previous
                        </Button>
                    )}

                    {events?.map((e, i) => {
                        const isSelf = e.sender?.userId === clientUserId;

                        return (
                            <Box
                                onClick={() => {
                                    handleResendEvent(e);
                                }}
                                key={e.getId() || i}
                                px={12}
                                py={4}
                                style={{
                                    maxWidth: '75%',
                                    marginLeft: isSelf ? 'auto' : undefined,
                                    marginRight: !isSelf ? 'auto' : undefined,
                                    border: `2px solid ${
                                        isSelf ? '#eaab00' : '#0098db'
                                    }`,
                                    borderRadius: 4,
                                }}
                            >
                                <Text fw={500} size={20} underline>
                                    {transformToChatGmUserId(e.sender?.userId)}
                                    {' | '}
                                    {dayjs(e.event.origin_server_ts).format(
                                        'YYYY-MM-DD | hh:mm:ss'
                                    )}
                                </Text>

                                <Text
                                    component="pre"
                                    style={{
                                        wordBreak: 'break-all',
                                        wordWrap: 'break-word',
                                        // @ts-ignore
                                        textWrap: 'wrap',
                                    }}
                                >
                                    {JSON.stringify(
                                        {
                                            type: e.getType(),
                                            content: e.getContent(),
                                        },
                                        null,
                                        4
                                    )}
                                </Text>

                                {e.status && (
                                    <Text color="gray" size={14} ta="right">
                                        {e.status}...
                                    </Text>
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            </Box>

            <MessageComposer />
        </Stack>
    );
};
