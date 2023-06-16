import React from 'react';
import { Flex, TextInput, Button, Text } from '@mantine/core';
import { useChatBoxContext } from './chat-box-context';

export const MessageComposer = () => {
    const [textMessage, setTextMessage] = React.useState('');
    const { handleSendTextMessage } = useChatBoxContext();

    return (
        <Flex w={'100%'} gap={4}>
            <TextInput
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
