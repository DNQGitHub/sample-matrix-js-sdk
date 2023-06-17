import { Button, Flex } from '@mantine/core';
import { useActionBar } from './use-action-bar';
import { useAuthStore } from '~/services/auth-service/auth-store';

export const ActionBar = () => {
    const {
        matrixClient,
        handleStartMatrixClient,
        handleStopMatrixClient,
        handleCreateSoloRoom,
        handleCreateGroupRoom,
    } = useActionBar();

    const isLogined = useAuthStore((s) => s.authChatGmUser && s.authMatrixUser);

    return (
        <Flex gap={10}>
            <Button
                disabled={!isLogined || matrixClient.clientRunning}
                onClick={handleStartMatrixClient}
            >
                Start
            </Button>

            <Button
                disabled={!isLogined || !matrixClient.clientRunning}
                onClick={handleStopMatrixClient}
            >
                Stop
            </Button>

            <Button
                disabled={!isLogined || !matrixClient.clientRunning}
                onClick={() => handleCreateSoloRoom()}
            >
                Create Solo Room
            </Button>

            <Button
                disabled={!isLogined || !matrixClient.clientRunning}
                onClick={() => handleCreateGroupRoom()}
            >
                Create Group Room
            </Button>
        </Flex>
    );
};
