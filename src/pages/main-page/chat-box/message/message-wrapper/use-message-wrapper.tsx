import { EventStatus, MatrixEvent } from "matrix-js-sdk";
import { useMatrixContext } from "~/services/matrix-service/matrix-context";
import { useChatBoxContext } from "../../chat-box-context";
import React from "react";
import { EReaction } from "~/services/matrix-service/dtos";

export const useMessageWrapper = (
  event: MatrixEvent,
  index: number,
  events: MatrixEvent[]
) => {
  const [reactions, setReactions] = React.useState<Array<MatrixEvent>>([]);
  const [readUserIds, setReadUserIds] = React.useState<Array<string>>([]);

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

  const getReadUserIds = async () => {
    if (!room) {
      setReadUserIds([]);
      return;
    }

    if (event.status && event.status !== EventStatus.SENT) {
      setReadUserIds([]);
      return;
    }

    const roomMembers = room.getMembers();

    const readLog = roomMembers.map((member) => {
      const readReceipt = room.getReadReceiptForUserId(member.userId);

      return {
        userId: member.userId,
        readTs: readReceipt?.data.ts,
      };
    });

    const eventTs = event.getTs();

    const readUserIds = readLog
      .filter((log) => log.readTs && log.readTs >= eventTs)
      .map((log) => log.userId);

    setReadUserIds(readUserIds);
  };

  const sendReadReceipt = async () => {
    if (!room) return;

    const eventId = event.getId();
    if (!eventId) return;

    const isPending = !!room.getPendingEvent(eventId);
    if (isPending) return;

    if (event.status !== null && event.status !== EventStatus.SENT) return;
    if (index < events.length - 1) return;

    await matrixClient.sendReadReceipt(event);
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
    sendReadReceipt().then(() => getReadUserIds());
  }, []);

  React.useEffect(() => {
    sendReadReceipt().then(() => getReadUserIds());
  }, [event.status]);

  return {
    isSelf,
    readUserIds,
    reactions,
    handleResendEvent,
    handleReactEvent,
  };
};
