import React from 'react';
import { Box, Button, Stack, Text } from '@mantine/core';
import { MessageComposer } from './message-composer';
import { useChatBoxContext } from './chat-box-context';
import { EventMessage } from './message/event-message/event-message';

export const ChatBox = () => {
    const boxRef: React.RefObject<HTMLDivElement> = React.useRef<any>(null);
    const { room, events, shouldShowLatestEvent, handleLoadPreviousEvents } =
        useChatBoxContext();

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

                    {events?.map((e, index) => {
                        return (
                            <EventMessage
                                key={e.getId()}
                                event={e}
                                index={index}
                                events={events}
                            />
                        );
                    })}
                </Stack>
            </Box>

            <MessageComposer />
        </Stack>
    );
};
