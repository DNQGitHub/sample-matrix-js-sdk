import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useAuthContext } from '~/modules/auth/contexts/auth-context/auth-context';
import { matrixClient } from '~/modules/matrix/matrix-client';

export const useRoomList = () => {
    const { hasUserLogined } = useAuthContext();
    const [rooms, setRooms] = useState<Array<Room>>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room>();

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

    return { rooms, selectedRoom, setSelectedRoom };
};
