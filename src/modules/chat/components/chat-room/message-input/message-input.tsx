import { useState } from 'react';
import { Button, Flex, TextInput } from '@mantine/core';
import { useMessageInput } from './use-message-input';
import { MessageInputContext } from './message-input-context';

export const MessageInput = () => {
    const [text, setText] = useState('');
    const { sendTextMessage } = useMessageInput();

    return (
        <MessageInputContext.Provider
            value={{
                sendTextMessage,
            }}
        >
            <Flex
                p={20}
                gap={12}
                style={{
                    border: '1px solid black',
                    borderRadius: 8,
                }}
            >
                <TextInput
                    style={{ flex: 1 }}
                    value={text}
                    onChange={(e) => setText(e.currentTarget.value)}
                />

                <Button
                    onClick={() => {
                        sendTextMessage(text).finally(() => setText(''));
                    }}
                >
                    Send
                </Button>
            </Flex>
        </MessageInputContext.Provider>
    );
};
