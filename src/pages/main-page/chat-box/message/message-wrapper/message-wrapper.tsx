import { Box, Button, Flex, Stack, Text } from '@mantine/core';
import { EventStatus, MatrixEvent } from 'matrix-js-sdk';
import { PropsWithChildren } from 'react';
import { useMessageWrapper } from './use-message-wrapper';
import { transformToChatGmUserId } from '~/services/matrix-service/utils';
import dayjs from 'dayjs';
import { EReaction } from '~/services/matrix-service/dtos';

export type MessageWrapperProps = PropsWithChildren<{
    event: MatrixEvent;
}>;

export const MessageWrapper = ({ children, event }: MessageWrapperProps) => {
    const { isSelf, reactions, handleResendEvent, handleReactEvent } =
        useMessageWrapper(event);

    return (
        <Stack>
            <Box
                p={12}
                style={{
                    maxWidth: '80%',
                    marginLeft: isSelf ? 'auto' : undefined,
                    marginRight: !isSelf ? 'auto' : undefined,
                    border: `2px solid ${isSelf ? '#eaab00' : '#0098db'}`,
                    borderRadius: 4,
                }}
            >
                <Text fw={500} size={20} underline>
                    {transformToChatGmUserId(event.getSender())}
                    {' | '}
                    {dayjs(event.getDate()).format('YYYY-MM-DD | hh:mm:ss')}
                </Text>

                {children}

                {event.status && (
                    <Text color="gray" size={14} ta="right">
                        {event.status}...
                    </Text>
                )}

                <Flex gap={5} justify="flex-end">
                    {reactions.map((r) => (
                        <Text
                            key={r.getId()}
                            px={10}
                            py={2}
                            size={12}
                            bg={'gray.3'}
                            style={{
                                border: '1px solid gray',
                                borderRadius: 4,
                            }}
                        >
                            {r.event.content?.['m.relates_to']?.key}
                        </Text>
                    ))}
                </Flex>
            </Box>
            <Flex justify={isSelf ? 'flex-end' : 'flex-start'}>
                {isSelf && event.status === EventStatus.NOT_SENT && (
                    <Button onClick={() => handleResendEvent()}>Resend</Button>
                )}

                {!isSelf && (
                    <Flex gap={5}>
                        <Button
                            onClick={() => handleReactEvent(EReaction.LIKE)}
                        >
                            Like
                        </Button>
                        <Button
                            onClick={() => handleReactEvent(EReaction.SMILE)}
                        >
                            Haha
                        </Button>
                        <Button
                            onClick={() => handleReactEvent(EReaction.ANGRY)}
                        >
                            Angry
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Stack>
    );
};
