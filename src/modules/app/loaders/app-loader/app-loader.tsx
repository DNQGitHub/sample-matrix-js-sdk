import { PropsWithChildren } from 'react';
import { useAppLoader } from './use-app-loader';
import { Box, Text } from '@mantine/core';

export const AppLoader = ({ children }: PropsWithChildren) => {
    const { loadHandler } = useAppLoader();

    if (loadHandler.isIdle || loadHandler.isLoading) {
        return (
            <Box>
                <Text>Loading...</Text>
            </Box>
        );
    }

    return children;
};
