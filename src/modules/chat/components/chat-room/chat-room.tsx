import { PropsWithChildren } from "react";
import { RoomActionProvider } from "./contexts/room-action-context/room-action-provider";
import { RoomStateProvider } from "./contexts/room-state-context/room-state-provider";

export type ChatRoomProps = PropsWithChildren<{
    roomId?: string;
}>;

export const ChatRoom = ({ children, roomId }: ChatRoomProps) => {
    return (
        <RoomStateProvider roomId={roomId}>
            <RoomActionProvider>{children}</RoomActionProvider>
        </RoomStateProvider>
    );
};
