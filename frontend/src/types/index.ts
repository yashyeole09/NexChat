export type UserStatus = 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM' | 'AI_RESPONSE';
export type RoomType = 'DIRECT' | 'GROUP';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: User;
  roomId: string;
  replyToId?: string;
  fileUrl?: string;
  fileName?: string;
  edited: boolean;
  deleted: boolean;
  reactions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: RoomType;
  avatarUrl?: string;
  members: User[];
  createdBy?: User;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface SendMessageRequest {
  content: string;
  roomId: string;
  type?: MessageType;
  replyToId?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface TypingEvent {
  username: string;
  typing: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
}
