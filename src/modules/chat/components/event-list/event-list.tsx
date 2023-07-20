import { Button, ScrollArea, Stack } from "@mantine/core";
import { useRoomActionContext } from "../chat-room/contexts/room-action-context/room-action-context";
import { useRoomStateContext } from "../chat-room/contexts/room-state-context/room-state-context";
import { EventListItem } from "./event-list-item/event-list-item";

export const EventList = () => {
    const { events, room } = useRoomStateContext();
    const { scrollback } = useRoomActionContext();

    if (!room) {
        return null;
    }

    return (
        <ScrollArea
            p={20}
            h={500}
            style={{
                border: "1px solid black",
                borderRadius: 8,
                transform: "scaleY(-1)",
            }}
        >
            <Stack style={{ transform: "scaleY(-1)" }}>
                <Button onClick={scrollback}>Load previous</Button>

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
