import api from "./client";
import type { User, UserStatus } from "../types";

export const userApi = {
  getMe: () => api.get<User>("/users/me").then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    api.put<User>("/users/me", data).then((r) => r.data),

  updateStatus: (status: UserStatus) => api.put("/users/me/status", { status }),

  searchUsers: (q: string) =>
    api.get<User[]>("/users/search", { params: { q } }).then((r) => r.data),

  getUser: (userId: string) =>
    api.get<User>(`/users/${userId}`).then((r) => r.data),

  askAi: (message: string, context?: string) =>
    api.post<string>("/users/ai/ask", { message, context }).then((r) => {
      const data = r.data as any;
      return typeof data === "string" ? data : JSON.stringify(data);
    }),
  suggestReply: (message: string, context?: string) =>
    api
      .post<string>("/users/ai/suggest-reply", { message, context })
      .then((r) => r.data),
};
