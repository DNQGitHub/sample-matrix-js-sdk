import { Flex, TextInput, Button, Text } from '@mantine/core';
import { useMessageComposer } from './use-message-composer';

export const MessageComposer = () => {
    const { textMessage, setTextMessage, handleSendTextMessage } =
        useMessageComposer();

    return (
        <Flex w={'100%'} gap={4}>
            <TextInput
                style={{ flex: 1 }}
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyUp={(e) => {
                    if (e.code.toLowerCase() === 'enter') {
                        handleSendTextMessage();
                    }
                }}
            />
            <Button onClick={handleSendTextMessage}>
                <Text>Send</Text>
            </Button>
        </Flex>
    );
};
