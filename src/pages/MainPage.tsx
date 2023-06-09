import React, { MouseEventHandler } from 'react';
import { Box, Button, Container, Title } from '@mantine/core';
import { useMatrixContext } from '../contexts';

/**
 * @home_server https://matrix.tauhu.cloud
 * @user_id @gm.qtest1:matrix.tauhu.cloud
 * @access_token syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs
 */

export const MainPage = () => {
    const { startMatrixClient } = useMatrixContext();

    const onButtonStartClicked: MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        console.log('----> start button clicked');

        startMatrixClient({
            baseUrl: 'https://matrix.tauhu.cloud',
            userId: '@gm.qtest1:matrix.tauhu.cloud',
            accessToken: 'syt_Z20ucXRlc3Qx_ZYNarLrZqWzEjrGyYGYP_2t2iGs',
        });
    };

    return (
        <Box>
            <Container>
                <Title>Main Page</Title>

                <Button onClick={onButtonStartClicked}>Start</Button>
            </Container>
        </Box>
    );
};
