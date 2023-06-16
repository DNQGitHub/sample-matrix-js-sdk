import React from 'react';
import { useMatrixContext } from '../../../contexts';

export const useChatBox = () => {
    const { matrixClient, selectedRoom } = useMatrixContext();

    const timelineEvents = React.useMemo(() => {
        return selectedRoom?.getLiveTimeline().getEvents() || [];
    }, [selectedRoom]);

    const pendingEvents = React.useMemo(() => {
        return selectedRoom?.getPendingEvents() || [];
    }, [selectedRoom]);

    return {
        clientUserId: matrixClient?.getUserId(),
        room: selectedRoom,
        events: [...timelineEvents, ...pendingEvents],
    };
};
