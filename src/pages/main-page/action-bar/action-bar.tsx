import { Button, Flex } from '@mantine/core';
import { useActionBar } from './use-action-bar';

export const ActionBar = () => {
    const {
        matrixClient,
        handleStartMatrixClient,
        handleStopMatrixClient,
        handleCreateSoloRoom,
        handleCreateGroupRoom,
    } = useActionBar();

    return (
        <Flex gap={10}>
            <Button disabled={!!matrixClient} onClick={handleStartMatrixClient}>
                Start
            </Button>

            <Button disabled={!!!matrixClient} onClick={handleStopMatrixClient}>
                Stop
            </Button>

            <Button
                disabled={!!!matrixClient}
                onClick={() => handleCreateSoloRoom()}
            >
                Create Solo Room
            </Button>

            <Button
                disabled={!!!matrixClient}
                onClick={() => handleCreateGroupRoom()}
            >
                Create Group Room
            </Button>
        </Flex>
    );
};
