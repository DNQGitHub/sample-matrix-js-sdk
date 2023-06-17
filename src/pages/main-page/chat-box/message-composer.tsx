import React from 'react';
import { Flex, TextInput, Button, Text } from '@mantine/core';
import { useChatBoxContext } from './chat-box-context';

export const MessageComposer = () => {
    const [textMessage, setTextMessage] = React.useState('');
    const { room, handleSendTextMessage } = useChatBoxContext();

    return (
        <Flex w={'100%'} gap={4}>
            <TextInput
                disabled={!room}
                style={{ flex: 1 }}
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyUp={(e) => {
                    if (e.code.toLowerCase() === 'enter') {
                        handleSendTextMessage(textMessage);
                        setTextMessage('');
                    }
                }}
            />
            <Button
                disabled={!room}
                onClick={() => {
                    handleSendTextMessage(textMessage);
                    setTextMessage('');
                }}
            >
                <Text>Send</Text>
            </Button>
        </Flex>
    );
};
