import { EventType, MatrixEvent } from 'matrix-js-sdk';
import { useMatrixContext } from '~/services/matrix-service/matrix-context';
import { useChatBoxContext } from '../../chat-box-context';
import React from 'react';
import { Reactions } from '~/services/matrix-service/dtos';

export const useMessageWrapper = (event: MatrixEvent) => {
    const [reactions, setReactions] = React.useState<Array<MatrixEvent>>([]);

    const { matrixClient } = useMatrixContext();
    const { room, handleResendEvent, handleReactEvent } = useChatBoxContext();

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

    React.useEffect(() => {
        fetchReactions();
    }, []);

    return {
        isSelf,
        reactions,
        handleResendEvent: () => {
            handleResendEvent(event);
        },
        handleReactEvent: (reaction: Reactions) => {
            handleReactEvent(event, reaction).then(() => fetchReactions());
        },
    };
};
