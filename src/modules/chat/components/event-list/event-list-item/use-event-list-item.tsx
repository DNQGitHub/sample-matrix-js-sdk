import dayjs from "dayjs";
import { MatrixEvent } from "matrix-js-sdk";
import { matrixClient } from "~/modules/matrix/matrix-client";
import { useRoomStateContext } from "../../chat-room/contexts/room-state-context/room-state-context";

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
    const { room, eventReadUpTo } = useRoomStateContext();

    const eventId = event.getId();

    const sender = event.getSender();
    const myId = matrixClient.getUserId();
    const isSelf = myId === sender;

    const prevEvent = index - 1 < 0 ? undefined : events[index - 1];
    const prevEventSender = prevEvent?.getSender();

    const showSender = prevEventSender !== sender && !isSelf;

    const showDate =
        !prevEvent ||
        dayjs(event.getTs()).format("YYYY-MMM-DD") !==
            dayjs(prevEvent.getTs()).format("YYYY-MMM-DD");

    const showUnreadIndicator =
        !isSelf &&
        index < events.length - 1 &&
        event.getId() &&
        eventReadUpTo &&
        eventReadUpTo.getId() &&
        eventReadUpTo.getId() === event.getId();

    const reactions = eventId
        ? room?.relations.getAllChildEventsForEvent(eventId) || []
        : [];

    return {
        isSelf,
        sender,
        showDate,
        showSender,
        showUnreadIndicator,
        reactions,
    };
};
