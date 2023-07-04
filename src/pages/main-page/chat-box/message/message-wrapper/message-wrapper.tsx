import { Box, Button, Flex, Stack, Text } from '@mantine/core';
import { EventStatus, EventType, MatrixEvent } from 'matrix-js-sdk';
import { PropsWithChildren } from 'react';
import { useMessageWrapper } from './use-message-wrapper';
import { transformToChatGmUserId } from '~/services/matrix-service/utils';
import dayjs from 'dayjs';
import { EReaction } from '~/services/matrix-service/dtos';

export type MessageProps = {
    event: MatrixEvent;
    index: number;
    events: MatrixEvent[];
};

export type MessageWrapperProps = PropsWithChildren<MessageProps>;

export const MessageWrapper = ({
    children,
    event,
    index,
    events,
}: MessageWrapperProps) => {
    const {
        isSelf,
        readUserIds,
        reactions,
        handleResendEvent,
        handleReactEvent,
    } = useMessageWrapper(event, index, events);

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

                <Box>
                    <Text underline>Read by:</Text>
                    {readUserIds.map((userId, i) => (
                        <Text key={i}>* {userId}</Text>
                    ))}
                </Box>

                <Flex gap={5} justify="flex-end" wrap="wrap-reverse">
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

                {event.getType() === EventType.RoomMessage && (
                    <Flex gap={5}>
                        <Button
                            onClick={() => handleReactEvent(EReaction.GRINNING)}
                        >
                            {EReaction.GRINNING.toString()}
                        </Button>

                        <Button
                            onClick={() => handleReactEvent(EReaction.LAUGHING)}
                        >
                            {EReaction.LAUGHING.toString()}
                        </Button>

                        <Button
                            onClick={() =>
                                handleReactEvent(EReaction.KISSING_HEART)
                            }
                        >
                            {EReaction.KISSING_HEART.toString()}
                        </Button>

                        <Button
                            onClick={() =>
                                handleReactEvent(EReaction.HEART_EYES)
                            }
                        >
                            {EReaction.HEART_EYES.toString()}
                        </Button>

                        <Button
                            onClick={() =>
                                handleReactEvent(EReaction.COLD_FACE)
                            }
                        >
                            {EReaction.COLD_FACE.toString()}
                        </Button>

                        <Button
                            onClick={() =>
                                handleReactEvent(EReaction.SWEAT_SMILE)
                            }
                        >
                            {EReaction.SWEAT_SMILE.toString()}
                        </Button>
                    </Flex>
                )}
            </Flex>
        </Stack>
    );
};
