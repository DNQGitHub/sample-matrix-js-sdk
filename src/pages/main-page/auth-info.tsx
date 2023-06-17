import { Box, Text } from '@mantine/core';
import { useAuthStore } from '../../stores';

export const AuthInfo = () => {
    const auth = useAuthStore();

    return (
        <Box p={10} style={{ border: '1px solid black', borderRadius: 12 }}>
            <Text
                component="pre"
                my={0}
                style={{
                    // @ts-ignore
                    textWrap: 'wrap',
                    wordBreak: 'break-all',
                    wordWrap: 'break-word',
                }}
            >
                {JSON.stringify(auth, null, 4)}
            </Text>
        </Box>
    );
};
