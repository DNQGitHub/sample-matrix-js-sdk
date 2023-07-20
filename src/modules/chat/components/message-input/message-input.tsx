import { useState } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import { useRoomStateContext } from "../chat-room/contexts/room-state-context/room-state-context";
import { useRoomActionContext } from "../chat-room/contexts/room-action-context/room-action-context";

export const MessageInput = () => {
    const { room } = useRoomStateContext();
    const [text, setText] = useState("");
    const { sendTextMessage } = useRoomActionContext();

    if (room?.getMyMembership() !== "join") {
        return null;
    }

    return (
        <Flex
            p={20}
            gap={12}
            style={{
                border: "1px solid black",
                borderRadius: 8,
            }}
        >
            <TextInput
                style={{ flex: 1 }}
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
            />

            <Button
                onClick={() => {
                    sendTextMessage(text).finally(() => setText(""));
                }}
            >
                Send
            </Button>
        </Flex>
    );
};
