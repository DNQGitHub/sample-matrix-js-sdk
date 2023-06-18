import { EventStatus, MatrixEvent } from 'matrix-js-sdk';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';
import { useChatBoxContext } from '../../chat-box-context';
import React from 'react';
import { EReaction } from '~/services/matrix-service/dtos';

export const useMessageWrapper = (
    event: MatrixEvent,
    index: number,
    events: MatrixEvent[]
) => {
    const [reactions, setReactions] = React.useState<Array<MatrixEvent>>([]);

    const { matrixClient } = useMatrixContext();
    const { room, ...chatBox } = useChatBoxContext();

    const isSelf = matrixClient.getUserId() === event.getSender();
    const readUserIds = React.useMemo(() => {
        if (!room) return [];

        if (event.status) return [];

        const roomMembers = room.getMembers();

        const readLog = roomMembers.map((member) => {
            const readReceipt = room.getReadReceiptForUserId(member.userId);

            return {
                userId: member.userId,
                readTs: readReceipt?.data.ts,
            };
        });

        const eventTs = event.getTs();

        return readLog
            .filter((log) => log.readTs && log.readTs >= eventTs)
            .map((log) => log.userId);
    }, [room, event.status]);

    const fetchReactions = async () => {
        if (!room) return;

        const eventId = event.getId();

        if (!eventId) return;

        const events = await matrixClient.fetchReactions(room.roomId, eventId);
        setReactions(events);
    };

    const sendReadReceipt = async () => {
        console.log('---> call send readReceipt', event.status, event.getId());

        if (!room) return;

        const eventId = event.getId();
        if (!eventId) return;

        const isPending = !!room.getPendingEvent(eventId);
        if (isPending) return;

        if (event.status !== null && event.status !== EventStatus.SENT) return;
        if (index < events.length - 1) return;

        console.log('---> start send readReceipt', event.getId());
        await matrixClient.sendReadReceipt(event);
        console.log('---> readReceipt sent', event.getId());
    };

    const handleResendEvent = async () => {
        await chatBox.handleResendEvent(event);
    };

    const handleReactEvent = async (reaction: EReaction) => {
        const eventId = event.getId();

        if (!eventId) return;

        await chatBox.handleReactEvent(eventId, reaction);
        fetchReactions();
    };

    React.useEffect(() => {
        fetchReactions();
    }, []);

    React.useEffect(() => {
        sendReadReceipt();
    }, [event.status]);

    return {
        isSelf,
        readUserIds,
        reactions,
        handleResendEvent,
        handleReactEvent,
    };
};
