import React from 'react';
import { useMatrixContext } from '../../../contexts';

export const useChatBox = () => {
    const { matrixClient, selectedRoom } = useMatrixContext();

    const timelineEvents = React.useMemo(() => {
        return selectedRoom?.getLiveTimeline().getEvents();
    }, [selectedRoom]);

    return {
        clientUserId: matrixClient?.getUserId(),
        room: selectedRoom,
        timelineEvents,
    };
};
