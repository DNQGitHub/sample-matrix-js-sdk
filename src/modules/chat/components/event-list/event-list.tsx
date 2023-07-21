import { Button, ScrollArea, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useRoomActionContext } from "../chat-room/contexts/room-action-context/room-action-context";
import { useRoomStateContext } from "../chat-room/contexts/room-state-context/room-state-context";
import { EventListItem } from "./event-list-item/event-list-item";

export const EventList = () => {
    const scrollAreaViewPort: React.ForwardedRef<HTMLDivElement> = useRef(null);
    const didInitialScroll = useRef(false);

    const { events, room } = useRoomStateContext();
    const { scrollback } = useRoomActionContext();

    useEffect(() => {
        if (room && events.length > 0 && !didInitialScroll.current) {
            scrollAreaViewPort.current?.scroll({
                top: scrollAreaViewPort.current.scrollHeight,
            });
            didInitialScroll.current = true;
        }
    }, [room, events]);

    if (!room) {
        return null;
    }

    return (
        <ScrollArea
            viewportRef={scrollAreaViewPort}
            p={20}
            h={500}
            style={{
                border: "1px solid black",
                borderRadius: 8,
            }}
            styles={{
                viewport: {
                    "& > div": {
                        height: "100%",
                    },
                },
            }}
        >
            <Stack style={{ width: "100%", height: "100%" }}>
                <Button onClick={scrollback} style={{ marginBottom: "auto" }}>
                    Load previous
                </Button>

                {events.map((e, index, events) => (
                    <EventListItem
                        key={`${e.getId()}-${index}`}
                        event={e}
                        index={index}
                        events={events}
                    />
                ))}
            </Stack>
        </ScrollArea>
    );
};
