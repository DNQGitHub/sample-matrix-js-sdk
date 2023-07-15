import { Flex, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { MatrixEvent } from 'matrix-js-sdk';
import { matrixClient } from '~/modules/matrix/matrix-client';
import { transformToChatGmUserId } from '~/modules/matrix/utils';
import { useChatRoomContext } from '../chat-room-context';

export type EventListItemProps = {
    event: MatrixEvent;
    index: number;
    events: MatrixEvent[];
};

export const EventListItem = ({ event, index, events }: EventListItemProps) => {
    const { eventReadUpToId } = useChatRoomContext();
    const sender = event.getSender();
    const isSelf = matrixClient.getUserId() === sender;
    const prevEvent = index - 1 < 0 ? undefined : events[index - 1];
    // const nextEvent =
    //     index + 1 >= events.length ? undefined : events[index + 1];
    const prevEventSender = prevEvent?.getSender();

    const showSender = prevEventSender !== sender && !isSelf;
    const showDate =
        !prevEvent || dayjs(event.getTs()).diff(prevEvent.getTs(), 'days') > 0;
    const showUnreadIndicator =
        index < events.length - 1 &&
        eventReadUpToId &&
        eventReadUpToId === event.getId();

    return (
        <Stack
            style={{
                alignItems: isSelf ? 'flex-end' : 'flex-start',
            }}
        >
            {showDate && (
                <Text align="center" w={'100%'}>
                    {''.padEnd(15, '-')}{' '}
                    {dayjs(event.getTs()).format('YYYY - MMM - DD')}{' '}
                    {''.padEnd(15, '-')}
                </Text>
            )}

            {showSender && (
                <Text component="b" size={20}>
                    {`@${transformToChatGmUserId(sender)}`}
                </Text>
            )}

            <Stack
                maw={'70%'}
                p={12}
                style={{
                    gap: 1,
                    border: `2px solid ${isSelf ? '#fa9c4a' : '#4264e0'}`,
                    borderRadius: 12,
                    boxShadow:
                        'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                }}
            >
                <Text component="b">{event.getType()}</Text>
                <Text>{event.getId()}</Text>
                <Text>{''.padEnd(20, '-')}</Text>
                <Text
                    component="pre"
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                    }}
                >
                    {JSON.stringify(event.getContent(), null, 4)}
                </Text>

                <Flex justify={'space-between'}>
                    <Text>[:reaction]</Text>
                    <Text align="right">
                        {dayjs(event.getTs()).format('hh:mm A')}
                    </Text>
                </Flex>
            </Stack>

            {showUnreadIndicator && (
                <Text align="center" w={'100%'}>
                    {''.padEnd(10, '=')} Unread messages {''.padEnd(10, '=')}
                </Text>
            )}
        </Stack>
    );
};
