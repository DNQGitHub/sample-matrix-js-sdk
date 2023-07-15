import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '~/modules/auth/contexts/auth-context/auth-context';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useRoomList = () => {
    const { hasUserLogined } = useAuthContext();
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();

    const sortedRooms = useMemo(
        () =>
            rooms.sort((r1, r2) => {
                return (
                    r2.getLastActiveTimestamp() - r1.getLastActiveTimestamp()
                );
            }),
        [rooms]
    );

    useEffect(() => {
        const handleRoomTimeline = () => {
            console.log('[RoomList]: update room timeline');
            setRooms(matrixClient.getRooms());
        };

        setRooms(matrixClient.getRooms());

        matrixClient.on(RoomEvent.Timeline, handleRoomTimeline);

        return () => {
            matrixClient.off(RoomEvent.Timeline, handleRoomTimeline);
        };
    }, []);

    useEffect(() => {
        if (!hasUserLogined) {
            setRooms([]);
        }
    }, [hasUserLogined]);

    return { rooms, sortedRooms, selectedRoom, setSelectedRoom };
};
