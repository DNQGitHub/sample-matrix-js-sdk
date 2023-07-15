import { ScrollArea, Stack } from '@mantine/core';
import { useChatRoomContext } from '../chat-room-context';
import { EventListItem } from './event-list-item';

export const EventList = () => {
    const { events } = useChatRoomContext();

    return (
        <ScrollArea
            p={20}
            h={500}
            style={{
                border: '1px solid black',
                borderRadius: 8,
            }}
        >
            <Stack>
                {events.map((e, index, events) => (
                    <EventListItem event={e} index={index} events={events} />
                ))}
            </Stack>
        </ScrollArea>
    );
};
