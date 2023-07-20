import { Box, Button } from "@mantine/core";
import { useRoomStateContext } from "../chat-room/contexts/room-state-context/room-state-context";
import { useMembershipInfo } from "./use-membership-info";

export const MembershipInfo = () => {
    const { room } = useRoomStateContext();
    const myMembership = room?.getMyMembership();
    const { joinRoomHandler } = useMembershipInfo();

    if (myMembership === "join") {
        return null;
    }

    if (myMembership === "leave") {
        return null;
    }

    return (
        <Box
            p={20}
            style={{
                border: "1px solid black",
                borderRadius: 8,
            }}
        >
            <Button
                disabled={joinRoomHandler.isLoading}
                onClick={() => joinRoomHandler.mutateAsync()}
                fullWidth
            >
                Join
            </Button>
        </Box>
    );
};
