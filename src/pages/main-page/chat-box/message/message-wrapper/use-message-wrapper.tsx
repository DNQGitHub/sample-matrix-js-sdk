import { MatrixEvent } from 'matrix-js-sdk';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';
import { useChatBoxContext } from '../../chat-box-context';
import React from 'react';
import { EReaction } from '~/services/matrix-service/dtos';

export const useMessageWrapper = (event: MatrixEvent) => {
    const [reactions, setReactions] = React.useState<Array<MatrixEvent>>([]);

    const { matrixClient } = useMatrixContext();
    const { room, ...chatBox } = useChatBoxContext();

    const isSelf = matrixClient.getUserId() === event.getSender();

    const fetchReactions = async () => {
        if (!room) return;

        const eventId = event.getId();

        if (!eventId) return;

        const events = await matrixClient.fetchReactions(room.roomId, eventId);
        setReactions(events);
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

    return {
        isSelf,
        reactions,
        handleResendEvent,
        handleReactEvent,
    };
};
