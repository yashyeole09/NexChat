package com.nexchat.controller;

import com.nexchat.dto.response.UserResponse;
import com.nexchat.entity.User;
import com.nexchat.enums.UserStatus;
import com.nexchat.repository.UserRepository;
import com.nexchat.service.impl.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final AiService aiService;

    public UserController(UserRepository userRepository, AiService aiService) {
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(toUserResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String,String> updates,
            @AuthenticationPrincipal User user) {
        if (updates.containsKey("displayName")) user.setDisplayName(updates.get("displayName"));
        if (updates.containsKey("bio")) user.setBio(updates.get("bio"));
        if (updates.containsKey("avatarUrl")) user.setAvatarUrl(updates.get("avatarUrl"));
        return ResponseEntity.ok(toUserResponse(userRepository.save(user)));
    }

    @PutMapping("/me/status")
    public ResponseEntity<Void> updateStatus(@RequestBody Map<String,String> body,
            @AuthenticationPrincipal User user) {
        userRepository.updateStatus(user.getId(), UserStatus.valueOf(body.get("status")));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(userRepository.searchUsers(q).stream()
            .map(this::toUserResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String userId) {
        return userRepository.findById(userId)
            .map(u -> ResponseEntity.ok(toUserResponse(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ai/ask")
    public ResponseEntity<CompletableFuture<String>> askAi(@RequestBody Map<String,String> body) {
        return ResponseEntity.ok(aiService.generateAiResponse(body.get("message"), body.get("context")));
    }

    @PostMapping("/ai/suggest-reply")
    public ResponseEntity<CompletableFuture<String>> suggestReply(@RequestBody Map<String,String> body) {
        return ResponseEntity.ok(aiService.suggestReply(body.get("message"), body.get("context")));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId()).username(user.getUsername()).email(user.getEmail())
            .displayName(user.getDisplayName()).avatarUrl(user.getAvatarUrl())
            .bio(user.getBio()).status(user.getStatus())
            .lastSeen(user.getLastSeen()).createdAt(user.getCreatedAt()).build();
    }
}
