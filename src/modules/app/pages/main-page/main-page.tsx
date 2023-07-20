import { Container, Flex, Stack } from "@mantine/core";
import { AuthBox, LoginForm } from "../../../auth/components";
import { RoomList } from "~/modules/chat/components";
import { useState } from "react";
import { Room } from "matrix-js-sdk";
import { ChatRoom } from "~/modules/chat/components/chat-room/chat-room";
import { RoomInfo } from "~/modules/chat/components/room-info/room-info";
import { EventList } from "~/modules/chat/components/event-list/event-list";
import { MessageInput } from "~/modules/chat/components/message-input/message-input";

export const MainPage = () => {
    const [currentRoom, setCurrentRoom] = useState<Room>();

    return (
        <Container>
            <Stack>
                <LoginForm />
                <AuthBox />

                <Flex gap={12} align={"stretch"}>
                    <RoomList
                        onRoomSelected={setCurrentRoom}
                        style={{ flex: 3 }}
                    />

                    <ChatRoom roomId={currentRoom?.roomId}>
                        <Stack style={{ flex: 5, gap: 12 }}>
                            <RoomInfo />
                            <EventList />
                            <MessageInput />
                        </Stack>
                    </ChatRoom>
                </Flex>
            </Stack>
        </Container>
    );
};
