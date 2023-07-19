import { Box, Button } from '@mantine/core';
import { useChatRoomContext } from '../chat-room-context';
import { useMembershipInfo } from './use-membership-info';

export const MembershipInfo = () => {
    const { room } = useChatRoomContext();
    const myMembership = room?.getMyMembership();
    const { joinRoomHandler } = useMembershipInfo();

    if (myMembership === 'join') {
        return null;
    }

    if (myMembership === 'leave') {
        return null;
    }

    return (
        <Box
            p={20}
            style={{
                border: '1px solid black',
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
