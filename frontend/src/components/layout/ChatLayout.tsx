import { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import Sidebar from './Sidebar';
import ChatWindow from '../chat/ChatWindow';
import WelcomePanel from '../chat/WelcomePanel';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function ChatLayout() {
  const { activeRoomId, setActiveRoom, fetchRooms } = useChatStore();
  const { subscribeRoom } = useWebSocket();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    subscribeRoom(roomId);
    setShowSidebar(false); // hide sidebar on mobile when chat opens
  };

  const handleBack = () => {
    setShowSidebar(true);
    setActiveRoom('');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-400">
      {/* Sidebar - hidden on mobile when chat is open */}
      <div className={`${
        showSidebar ? 'flex' : 'hidden'
      } md:flex flex-shrink-0`}>
        <Sidebar onRoomSelect={handleRoomSelect} />
      </div>

      {/* Main content - hidden on mobile when sidebar is shown */}
      <main className={`${
        !showSidebar ? 'flex' : 'hidden'
      } md:flex flex-1 min-w-0`}>
        {activeRoomId ? (
          <ChatWindow roomId={activeRoomId} onBack={handleBack} />
        ) : (
          <WelcomePanel />
        )}
      </main>
    </div>
  );
}