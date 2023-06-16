import React from 'react';
import { useMatrixContext } from '../../../contexts';
import { EventStatus, MatrixEvent } from 'matrix-js-sdk';

export const useChatBox = () => {
    const { matrixClient, selectedRoom } = useMatrixContext();

    const timelineEvents = React.useMemo(() => {
        return selectedRoom?.getLiveTimeline().getEvents() || [];
    }, [selectedRoom]);

    const pendingEvents = React.useMemo(() => {
        return selectedRoom?.getPendingEvents() || [];
    }, [selectedRoom]);

    const handleResendEvent = (event: MatrixEvent) => {
        if (!selectedRoom) return;
        if (event.status !== EventStatus.NOT_SENT) return;

        matrixClient?.resendEvent(event, selectedRoom);
    };

    return {
        clientUserId: matrixClient?.getUserId(),
        room: selectedRoom,
        events: [...timelineEvents, ...pendingEvents],
        handleResendEvent,
    };
};
