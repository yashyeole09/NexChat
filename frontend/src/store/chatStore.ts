import { create } from 'zustand';
import type { ChatRoom, Message } from '../types';
import { chatApi } from '../api/chat';

interface ChatState {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  isLoadingRooms: boolean;
  isLoadingMessages: boolean;

  fetchRooms: () => Promise<void>;
  setActiveRoom: (roomId: string) => void;
  fetchMessages: (roomId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (roomId: string, messageId: string) => void;
  setTyping: (roomId: string, username: string, typing: boolean) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoomLastMessage: (roomId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  typingUsers: {},
  isLoadingRooms: false,
  isLoadingMessages: false,

  fetchRooms: async () => {
    set({ isLoadingRooms: true });
    try {
      const rooms = await chatApi.getRooms();
      set({ rooms });
    } finally {
      set({ isLoadingRooms: false });
    }
  },

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  fetchMessages: async (roomId) => {
    set({ isLoadingMessages: true });
    try {
      const msgs = await chatApi.getMessages(roomId);
      set((s) => ({
        messages: { ...s.messages, [roomId]: msgs.reverse() },
      }));
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((s) => {
      const existing = s.messages[message.roomId] || [];
      const alreadyExists = existing.some((m) => m.id === message.id);
      if (alreadyExists) return s;
      return {
        messages: {
          ...s.messages,
          [message.roomId]: [...existing, message],
        },
      };
    });
    get().updateRoomLastMessage(message.roomId, message);
  },

  updateMessage: (message) => {
    set((s) => {
      const msgs = (s.messages[message.roomId] || []).map((m) =>
        m.id === message.id ? message : m
      );
      return { messages: { ...s.messages, [message.roomId]: msgs } };
    });
  },

  deleteMessage: (roomId, messageId) => {
    set((s) => {
      const msgs = (s.messages[roomId] || []).map((m) =>
        m.id === messageId ? { ...m, deleted: true, content: '[Message deleted]' } : m
      );
      return { messages: { ...s.messages, [roomId]: msgs } };
    });
  },

  setTyping: (roomId, username, typing) => {
    set((s) => {
      const current = s.typingUsers[roomId] || [];
      const updated = typing
        ? [...new Set([...current, username])]
        : current.filter((u) => u !== username);
      return { typingUsers: { ...s.typingUsers, [roomId]: updated } };
    });
  },

  addRoom: (room) => {
    set((s) => ({ rooms: [room, ...s.rooms] }));
  },

  updateRoomLastMessage: (roomId, message) => {
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId ? { ...r, lastMessage: message, updatedAt: message.createdAt } : r
      ).sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    }));
  },
}));
