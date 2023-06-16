import React from 'react';
import { useMatrixContext } from '../../../../contexts';

export const useMessageComposer = () => {
    const [textMessage, setTextMessage] = React.useState('');
    const { matrixClient, selectedRoom } = useMatrixContext();

    const handleSendTextMessage = async () => {
        if (!selectedRoom || !matrixClient || !textMessage?.trim()) return;

        matrixClient.sendTextMessage(selectedRoom.roomId, textMessage);

        setTextMessage('');
    };

    return {
        textMessage,
        setTextMessage,
        handleSendTextMessage,
    };
};
