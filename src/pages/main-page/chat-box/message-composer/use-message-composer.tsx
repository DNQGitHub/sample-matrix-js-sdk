import React from 'react';
import { useMatrixContext } from '../../../../contexts';
import { resolvePromise } from '../../../../utils';

export const useMessageComposer = () => {
    const [textMessage, setTextMessage] = React.useState('');
    const { matrixClient, selectedRoom } = useMatrixContext();

    const handleSendTextMessage = async () => {
        if (!selectedRoom || !matrixClient || !textMessage?.trim()) return;

        const [sendMessageRes, sendMessageErr] = await resolvePromise(
            matrixClient.sendTextMessage(selectedRoom.roomId, textMessage)
        );

        console.log({ sendMessageRes, sendMessageErr });

        if (sendMessageErr || !sendMessageRes) {
            return;
        }

        setTextMessage('');
    };

    return {
        textMessage,
        setTextMessage,
        handleSendTextMessage,
    };
};
