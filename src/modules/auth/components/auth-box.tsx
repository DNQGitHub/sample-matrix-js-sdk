import { Box, Text } from '@mantine/core';
import { useAuthContext } from '../contexts/auth-context/auth-context';

export const AuthBox = () => {
    const { chatGmAuthUser, matrixAuthUser, hasUserLogined } = useAuthContext();

    if (!hasUserLogined) {
        return null;
    }

    return (
        <Box style={{ border: '1px solid black', borderRadius: 8 }} p={20}>
            <Box>
                <Text component="b">ChatGM Auth User:</Text>
                <Text
                    component="pre"
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                    }}
                >
                    {JSON.stringify(chatGmAuthUser, null, 4)}
                </Text>
            </Box>

            <Box>
                <Text component="b">Matrix Auth User:</Text>
                <Text
                    component="pre"
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                    }}
                >
                    {JSON.stringify(matrixAuthUser, null, 4)}
                </Text>
            </Box>
        </Box>
    );
};
