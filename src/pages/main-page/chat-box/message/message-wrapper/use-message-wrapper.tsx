import { EventStatus, EventType, MatrixEvent } from 'matrix-js-sdk';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';
import { useChatBoxContext } from '../../chat-box-context';
import React from 'react';

export const useMessageWrapper = (event: MatrixEvent) => {
    const [reactions, setReactions] = React.useState<Array<MatrixEvent>>([]);

    const { matrixClient } = useMatrixContext();
    const { room } = useChatBoxContext();

    const isSelf = matrixClient.getUserId() === event.getSender();

    const fetchReactions = async () => {
        if (!room) return;

        const eventId = event.getId();

        if (!eventId) return;

        const response = await matrixClient.relations(
            room.roomId,
            eventId,
            'm.annotation',
            EventType.Reaction
        );
        setReactions(response.events);
    };

    const handleResendEvent = () => {
        if (!room) return;
        if (event.status !== EventStatus.NOT_SENT) return;

        matrixClient.resendEvent(event, room);
    };

    const handleReactEvent = (reaction: 'like' | 'haha' | 'angry') => {
        if (!room) return;

        matrixClient
            .sendEvent(room.roomId, EventType.Reaction, {
                'm.relates_to': {
                    event_id: event.getId(),
                    key: reaction,
                    rel_type: 'm.annotation',
                },
            })
            .then(() => fetchReactions());
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
