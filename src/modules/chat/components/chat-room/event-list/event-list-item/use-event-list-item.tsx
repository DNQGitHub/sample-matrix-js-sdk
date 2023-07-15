import dayjs from 'dayjs';
import { MatrixEvent } from 'matrix-js-sdk';
import { matrixClient } from '~/modules/matrix/matrix-client';
import { useChatRoomContext } from '../../chat-room-context';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';

export type UseEventListItemProps = {
    event: MatrixEvent;
    index: number;
    events: MatrixEvent[];
};

export const useEventListItem = ({
    event,
    index,
    events,
}: UseEventListItemProps) => {
    const { room, eventReadUpToId } = useChatRoomContext();

    const [reactions, setReactions] = useState<MatrixEvent[]>([]);

    const sender = event.getSender();
    const isSelf = matrixClient.getUserId() === sender;

    const prevEvent = index - 1 < 0 ? undefined : events[index - 1];
    const prevEventSender = prevEvent?.getSender();

    const showSender = prevEventSender !== sender && !isSelf;

    const showDate =
        !prevEvent || dayjs(event.getTs()).diff(prevEvent.getTs(), 'days') > 0;

    const showUnreadIndicator =
        index < events.length - 1 &&
        eventReadUpToId &&
        eventReadUpToId === event.getId();

    const fetchReactionsHandler = useMutation({
        mutationFn: async () => {
            const roomId = room?.roomId;

            if (!roomId) {
                return;
            }

            const eventId = event.getId();

            if (!eventId) {
                return;
            }

            const reactions = await matrixClient.fetchReactions(
                roomId,
                eventId
            );

            setReactions(reactions);
        },
    });

    const sendReactionHandler = useMutation({
        mutationFn: async (key: string) => {
            const roomId = room?.roomId;

            if (!roomId) {
                return;
            }

            const eventId = event.getId();

            if (!eventId) {
                return;
            }

            await matrixClient.sendReaction(roomId, eventId, key);

            await fetchReactionsHandler.mutateAsync();
        },
    });

    useEffect(
        () => {
            fetchReactionsHandler.mutate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return {
        isSelf,
        sender,
        showDate,
        showSender,
        showUnreadIndicator,
        reactions,
        sendReactionHandler,
    };
};