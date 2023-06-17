import { MatrixEvent } from 'matrix-js-sdk';
import { MessageWrapper } from '../message-wrapper/message-wrapper';
import { Text } from '@mantine/core';

export type EventMessageProps = {
    event: MatrixEvent;
};

export const EventMessage = ({ event }: EventMessageProps) => {
    return (
        <MessageWrapper event={event}>
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
