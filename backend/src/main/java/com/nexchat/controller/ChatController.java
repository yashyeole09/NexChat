package com.nexchat.controller;

import com.nexchat.dto.request.CreateRoomRequest;
import com.nexchat.dto.request.SendMessageRequest;
import com.nexchat.dto.response.ChatRoomResponse;
import com.nexchat.dto.response.MessageResponse;
import com.nexchat.entity.User;
import com.nexchat.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.createRoom(request, user.getId()));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getUserRooms(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getUserRooms(user.getId()));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomResponse> getRoom(@PathVariable String roomId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getRoomById(roomId, user.getId()));
    }

    @PostMapping("/rooms/direct/{targetUserId}")
    public ResponseEntity<ChatRoomResponse> getOrCreateDirectRoom(@PathVariable String targetUserId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getOrCreateDirectRoom(user.getId(), targetUserId));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(chatService.getMessages(roomId, page, size));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.sendMessage(request, user.getId()));
    }

    @PutMapping("/messages/{messageId}")
    public ResponseEntity<MessageResponse> editMessage(@PathVariable String messageId,
            @RequestBody Map<String,String> body, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.editMessage(messageId, body.get("content"), user.getId()));
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId,
            @AuthenticationPrincipal User user) {
        chatService.deleteMessage(messageId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/rooms/{roomId}/members/{userId}")
    public ResponseEntity<Void> addMember(@PathVariable String roomId, @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        chatService.addMember(roomId, userId, user.getId());
        return ResponseEntity.ok().build();
    }
}
