import {
    Box,
    Flex,
    Image,
    Stack,
    Text,
    UnstyledButton,
    createStyles,
    Anchor,
} from "@mantine/core";
import dayjs from "dayjs";
import { EventStatus, MatrixEvent } from "matrix-js-sdk";
import { transformToChatGmUserId } from "~/modules/matrix/utils";
import { useEventListItem } from "./use-event-list-item";
import {
    EMOJIS_MAP,
    EMOJIS_USED_FOR_REACTIONS,
} from "~/modules/chat/constants";
import { useRoomActionContext } from "../../chat-room/contexts/room-action-context/room-action-context";
import { useEffect, useRef } from "react";

const useStyles = createStyles(() => ({
    container: {
        "& .contentContainer + .reactionContainer": {
            display: "none",
        },

        "& .contentContainer:hover + .reactionContainer, .reactionContainer:hover":
            {
                display: "flex",
            },
    },
}));

export type EventListItemProps = {
    event: MatrixEvent;
    index: number;
    events: MatrixEvent[];
};

export const EventListItem = ({ event, index, events }: EventListItemProps) => {
    const { classes } = useStyles();

    const {
        isSelf,
        sender,
        reactions,
        showDate,
        showSender,
        showUnreadIndicator,
    } = useEventListItem({ event, index, events });

    const { reactEvent, resendEvent } = useRoomActionContext();

    const thiz: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (event.status === EventStatus.SENDING) {
            thiz.current?.scrollIntoView();
        }
    }, [event.status]);

    return (
        <Stack
            ref={thiz}
            className={classes.container}
            pos={"relative"}
            style={{
                alignItems: isSelf ? "flex-end" : "flex-start",
            }}
        >
            {showDate && (
                <Text align="center" w={"100%"}>
                    {"".padEnd(15, "-")}{" "}
                    {dayjs(event.getTs()).format("YYYY - MMM - DD")}{" "}
                    {"".padEnd(15, "-")}
                </Text>
            )}

            {showSender && (
                <Text component="b" size={20}>
                    {`@${transformToChatGmUserId(sender)}`}
                </Text>
            )}

            <Stack
                className="contentContainer"
                maw={"70%"}
                p={12}
                style={{
                    gap: 1,
                    border: `2px solid ${isSelf ? "#fa9c4a" : "#4264e0"}`,
                    borderRadius: 12,
                    boxShadow:
                        "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                }}
            >
                <Text component="b">{event.getType()}</Text>
                <Text>{event.getId()}</Text>

                <Text>{"".padEnd(20, "-")}</Text>

                <Text
                    component="pre"
                    style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                    }}
                >
                    {JSON.stringify(event.getContent(), null, 4)}
                </Text>

                <Flex justify={"space-between"}>
                    <Flex>
                        {reactions.map((r, index) => {
                            const key = r.getContent()["m.relates_to"]?.key;

                            if (!key) return null;
                            const emoji = EMOJIS_MAP[key];

                            if (!emoji) return null;

                            return (
                                <Image
                                    key={`${r.getId()} - ${index}`}
                                    src={emoji.imageUrl}
                                    w={24}
                                    h={24}
                                    width={24}
                                    height={24}
                                />
                            );
                        })}
                    </Flex>
                    <Text
                        align="right"
                        miw={100}
                        style={{ alignSelf: "flex-end" }}
                    >
                        {dayjs(event.getTs()).format("hh:mm A")}
                    </Text>
                </Flex>
            </Stack>

            <Flex
                className="reactionContainer"
                gap={10}
                pos={"absolute"}
                p={12}
                right={isSelf ? 10 : undefined}
                left={!isSelf ? 10 : undefined}
                bottom={16}
                style={{
                    borderRadius: 100,
                    backgroundColor: "#ffffff",
                    boxShadow:
                        "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
                }}
            >
                {EMOJIS_USED_FOR_REACTIONS.map((e, index) => (
                    <UnstyledButton
                        key={`${e.key} - ${index}`}
                        onClick={() => reactEvent(event, e.key)}
                    >
                        <Image
                            src={e.imageUrl}
                            w={36}
                            h={36}
                            width={36}
                            height={36}
                        />
                    </UnstyledButton>
                ))}
            </Flex>

            <Box>
                {event.status !== EventStatus.NOT_SENT && (
                    <Text>{event.status}</Text>
                )}
                {event.status === EventStatus.NOT_SENT && (
                    <Flex>
                        <Text>
                            <Anchor onClick={() => resendEvent(event)}>
                                Resend
                            </Anchor>
                            {" - "}
                            {event.status}
                        </Text>
                    </Flex>
                )}
            </Box>

            {showUnreadIndicator && (
                <Text align="center" w={"100%"}>
                    {"".padEnd(10, "=")} Unread messages {"".padEnd(10, "=")}
                </Text>
            )}
        </Stack>
    );
};
