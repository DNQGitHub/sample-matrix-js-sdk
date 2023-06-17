import {
    MessageProps,
    MessageWrapper,
} from '../message-wrapper/message-wrapper';
import { Text } from '@mantine/core';

export type EventMessageProps = MessageProps;

export const EventMessage = ({ event, index, events }: EventMessageProps) => {
    return (
        <MessageWrapper event={event} index={index} events={events}>
            <Text
                component="pre"
                style={{
                    wordBreak: 'break-all',
                    wordWrap: 'break-word',
                    whiteSpace: 'break-spaces',
                }}
            >
                {JSON.stringify(
                    {
                        id: event.getId(),
                        type: event.getType(),
                        content: event.getContent(),
                    },
                    null,
                    4
                )}
            </Text>
        </MessageWrapper>
    );
};
