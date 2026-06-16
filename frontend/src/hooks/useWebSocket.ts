import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import type { Message, TypingEvent } from '../types';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addMessage, updateMessage, deleteMessage, setTyping, rooms } = useChatStore();

  const connect = useCallback(() => {
    if (!accessToken || !isAuthenticated) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log('WebSocket connected');
        // Subscribe to all user rooms
        rooms.forEach((room) => subscribeToRoom(client, room.id));
      },

      onDisconnect: () => console.log('WebSocket disconnected'),
      onStompError: (frame) => console.error('STOMP error:', frame),
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [accessToken, isAuthenticated]);

  const subscribeToRoom = useCallback((client: Client, roomId: string) => {
    // New messages
    client.subscribe(`/topic/room/${roomId}`, (msg: IMessage) => {
      const message: Message = JSON.parse(msg.body);
      addMessage(message);
    });

    // Edits
    client.subscribe(`/topic/room/${roomId}/edits`, (msg: IMessage) => {
      updateMessage(JSON.parse(msg.body));
    });

    // Deletes
    client.subscribe(`/topic/room/${roomId}/deletes`, (msg: IMessage) => {
      deleteMessage(roomId, msg.body.replace(/"/g, ''));
    });

    // Typing indicators
    client.subscribe(`/topic/room/${roomId}/typing`, (msg: IMessage) => {
      const event: TypingEvent = JSON.parse(msg.body);
      setTyping(roomId, event.username, event.typing === 'true');
    });
  }, [addMessage, updateMessage, deleteMessage, setTyping]);

  useEffect(() => {
    const cleanup = connect();
    return () => { cleanup?.(); };
  }, [connect]);

  const sendTyping = useCallback((roomId: string, typing: boolean) => {
    clientRef.current?.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({ roomId, typing: String(typing) }),
    });
  }, []);

  const subscribeRoom = useCallback((roomId: string) => {
    if (clientRef.current?.connected) {
      subscribeToRoom(clientRef.current, roomId);
    }
  }, [subscribeToRoom]);

  return { client: clientRef.current, sendTyping, subscribeRoom };
}
