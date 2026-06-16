package com.nexchat.service;

import com.nexchat.dto.request.CreateRoomRequest;
import com.nexchat.dto.request.SendMessageRequest;
import com.nexchat.dto.response.ChatRoomResponse;
import com.nexchat.dto.response.MessageResponse;

import java.util.List;

public interface ChatService {
    ChatRoomResponse createRoom(CreateRoomRequest request, String userId);
    ChatRoomResponse getOrCreateDirectRoom(String userId1, String userId2);
    List<ChatRoomResponse> getUserRooms(String userId);
    ChatRoomResponse getRoomById(String roomId, String userId);
    MessageResponse sendMessage(SendMessageRequest request, String userId);
    List<MessageResponse> getMessages(String roomId, int page, int size);
    MessageResponse editMessage(String messageId, String content, String userId);
    void deleteMessage(String messageId, String userId);
    void addMember(String roomId, String userId, String requesterId);
    void removeMember(String roomId, String userId, String requesterId);
}
