import { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import Sidebar from './Sidebar';
import ChatWindow from '../chat/ChatWindow';
import WelcomePanel from '../chat/WelcomePanel';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function ChatLayout() {
  const { activeRoomId, setActiveRoom, fetchRooms } = useChatStore();
  const { subscribeRoom } = useWebSocket();

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    subscribeRoom(roomId);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-400">
      <Sidebar onRoomSelect={handleRoomSelect} />
      <main className="flex-1 min-w-0">
        {activeRoomId ? (
          <ChatWindow roomId={activeRoomId} />
        ) : (
          <WelcomePanel />
        )}
      </main>
    </div>
  );
}
