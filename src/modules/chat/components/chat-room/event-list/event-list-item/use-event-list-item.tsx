import dayjs from 'dayjs';
import { MatrixEvent } from 'matrix-js-sdk';
import { matrixClient } from '~/modules/matrix/matrix-client';
import { useChatRoomContext } from '../../chat-room-context';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import { EVENT_UPDATE_REQUESTED } from '~/modules/matrix/constants';

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
    const { room, eventReadUpTo } = useChatRoomContext();

    const [reactions, setReactions] = useState<MatrixEvent[]>([]);

    const sender = event.getSender();
    const myId = matrixClient.getUserId();
    const isSelf = myId === sender;

    const prevEvent = index - 1 < 0 ? undefined : events[index - 1];
    const prevEventSender = prevEvent?.getSender();

    const showSender = prevEventSender !== sender && !isSelf;

    const showDate =
        !prevEvent ||
        dayjs(event.getTs()).format('YYYY-MMM-DD') !==
            dayjs(prevEvent.getTs()).format('YYYY-MMM-DD');

    const showUnreadIndicator =
        !isSelf &&
        index < events.length - 1 &&
        event.getId() &&
        eventReadUpTo &&
        eventReadUpTo.getId() &&
        eventReadUpTo.getId() === event.getId();

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

    const resendEvent = async () => {
        if (!room) {
            return;
        }

        await matrixClient.resendEvent(event, room);
    };

    const sendReadReceipt = async () => {
        if (event.status) {
            return;
        }

        if (eventReadUpTo && eventReadUpTo.getTs() > event.getTs()) {
            return;
        }

        matrixClient.sendReadReceipt(event);
    };

    useEffect(
        () => {
            fetchReactionsHandler.mutate();

            const handleUpdateEvent = () => {
                fetchReactionsHandler.mutate();
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            event.on<any>(EVENT_UPDATE_REQUESTED, handleUpdateEvent);

            return () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                event.off<any>(EVENT_UPDATE_REQUESTED, handleUpdateEvent);
            };
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
        resendEvent,
        sendReadReceipt,
    };
};
