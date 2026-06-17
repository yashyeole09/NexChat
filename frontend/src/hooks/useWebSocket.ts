import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import type { Message, TypingEvent } from '../types';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addMessage, updateMessage, deleteMessage, setTyping, rooms } = useChatStore();

  const subscribeToRoom = useCallback((client: Client, roomId: string) => {
    client.subscribe(`/topic/room/${roomId}`, (msg) => {
      const message: Message = JSON.parse(msg.body);
      addMessage(message);
    });
    client.subscribe(`/topic/room/${roomId}/edits`, (msg) => {
      updateMessage(JSON.parse(msg.body));
    });
    client.subscribe(`/topic/room/${roomId}/deletes`, (msg) => {
      deleteMessage(roomId, msg.body.replace(/"/g, ''));
    });
    client.subscribe(`/topic/room/${roomId}/typing`, (msg) => {
      const event: TypingEvent = JSON.parse(msg.body);
      setTyping(roomId, event.username, event.typing === 'true');
    });
  }, [addMessage, updateMessage, deleteMessage, setTyping]);

  const connect = useCallback(() => {
    if (!accessToken || !isAuthenticated) return undefined;
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws') as any,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 3000,
      onConnect: () => {
        rooms.forEach((room) => subscribeToRoom(client, room.id));
      },
      onDisconnect: () => console.log('WebSocket disconnected'),
      onStompError: (frame) => console.error('STOMP error:', frame),
    });
    client.activate();
    clientRef.current = client;
    return () => { client.deactivate(); };
  }, [accessToken, isAuthenticated, rooms, subscribeToRoom]);

  useEffect(() => {
    const cleanup = connect();
    return () => { if (cleanup) cleanup(); };
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