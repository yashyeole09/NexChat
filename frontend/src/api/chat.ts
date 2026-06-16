import api from './client';
import type { ChatRoom, Message, SendMessageRequest } from '../types';

export const chatApi = {
  getRooms: () => api.get<ChatRoom[]>('/chat/rooms').then((r) => r.data),

  getRoom: (roomId: string) =>
    api.get<ChatRoom>(`/chat/rooms/${roomId}`).then((r) => r.data),

  createRoom: (data: { name: string; description?: string; memberIds?: string[] }) =>
    api.post<ChatRoom>('/chat/rooms', data).then((r) => r.data),

  getOrCreateDirectRoom: (targetUserId: string) =>
    api.post<ChatRoom>(`/chat/rooms/direct/${targetUserId}`).then((r) => r.data),

  getMessages: (roomId: string, page = 0, size = 50) =>
    api.get<Message[]>(`/chat/rooms/${roomId}/messages`, { params: { page, size } }).then((r) => r.data),

  sendMessage: (data: SendMessageRequest) =>
    api.post<Message>('/chat/messages', data).then((r) => r.data),

  editMessage: (messageId: string, content: string) =>
    api.put<Message>(`/chat/messages/${messageId}`, { content }).then((r) => r.data),

  deleteMessage: (messageId: string) =>
    api.delete(`/chat/messages/${messageId}`),

  addMember: (roomId: string, userId: string) =>
    api.post(`/chat/rooms/${roomId}/members/${userId}`),
};
