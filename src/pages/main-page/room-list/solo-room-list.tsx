import React from "react";
import dayjs from "dayjs";
import { UnstyledButton, Stack, Text, Box } from "@mantine/core";
import { transformToChatGmUserId } from "~/services/matrix-service/utils";
import { useMatrixContext } from "~/services/matrix-service/matrix-context";

export const SoloRoomList = () => {
  const { rooms, selectedRoom, setSelectedRoom } = useMatrixContext();

  const filterRooms = React.useMemo(() => {
    return rooms.filter((r) => r.name.split("_").length === 2);
  }, [rooms]);

  return (
    <Stack>
      {filterRooms.map((r) => {
        const latestEvent = r.getLastLiveEvent();
        const isSelectedRoom = r.roomId === selectedRoom?.roomId;

        return (
          <UnstyledButton
            key={r.roomId}
            p={12}
            style={{
              borderRadius: 8,
              backgroundColor: isSelectedRoom ? "#dedede" : undefined,
            }}
            onClick={() => setSelectedRoom(r)}
          >
            <Text fw={700} mb={10}>
              [ {r.name} ]
            </Text>
            <Stack spacing={5} ml={15}>
              <Text underline>
                {transformToChatGmUserId(latestEvent?.sender?.userId)}
                {" | "}
                {dayjs(latestEvent?.event.origin_server_ts).fromNow()}
              </Text>

              <Text
                style={{
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                  // @ts-ignore
                  textWrap: "wrap",
                }}
              >
                {JSON.stringify(latestEvent?.event.content)}
              </Text>

              <Box>
                <Text underline>Read by:</Text>
                {(latestEvent ? r.getUsersReadUpTo(latestEvent) : []).map(
                  (userId, i) => (
                    <Text key={i}>* {userId}</Text>
                  )
                )}
              </Box>
            </Stack>
          </UnstyledButton>
        );
      })}
    </Stack>
  );
};
