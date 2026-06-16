package com.nexchat.service.impl;

import com.nexchat.dto.request.CreateRoomRequest;
import com.nexchat.dto.request.SendMessageRequest;
import com.nexchat.dto.response.ChatRoomResponse;
import com.nexchat.dto.response.MessageResponse;
import com.nexchat.dto.response.UserResponse;
import com.nexchat.entity.ChatRoom;
import com.nexchat.entity.Message;
import com.nexchat.entity.User;
import com.nexchat.enums.RoomType;
import com.nexchat.exception.ResourceNotFoundException;
import com.nexchat.exception.UnauthorizedException;
import com.nexchat.repository.ChatRoomRepository;
import com.nexchat.repository.MessageRepository;
import com.nexchat.repository.UserRepository;
import com.nexchat.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {
    private static final Logger log = LoggerFactory.getLogger(ChatServiceImpl.class);

    private final ChatRoomRepository roomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatServiceImpl(ChatRoomRepository roomRepository, MessageRepository messageRepository,
                           UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override @Transactional
    public ChatRoomResponse createRoom(CreateRoomRequest request, String userId) {
        User creator = getUser(userId);
        Set<User> members = new HashSet<>();
        members.add(creator);
        if (request.getMemberIds() != null) {
            request.getMemberIds().forEach(id -> userRepository.findById(id).ifPresent(members::add));
        }
        ChatRoom room = ChatRoom.builder()
            .name(request.getName()).description(request.getDescription())
            .type(request.getType()).createdBy(creator).members(members).build();
        room = roomRepository.save(room);
        return toChatRoomResponse(room, userId);
    }

    @Override @Transactional
    public ChatRoomResponse getOrCreateDirectRoom(String userId1, String userId2) {
        return roomRepository.findDirectRoom(userId1, userId2)
            .map(r -> toChatRoomResponse(r, userId1))
            .orElseGet(() -> {
                User user1 = getUser(userId1);
                User user2 = getUser(userId2);
                ChatRoom room = ChatRoom.builder()
                    .name(user2.getDisplayName()).type(RoomType.DIRECT)
                    .createdBy(user1).members(new HashSet<>(Set.of(user1, user2))).build();
                return toChatRoomResponse(roomRepository.save(room), userId1);
            });
    }

    @Override @Transactional(readOnly = true)
    public List<ChatRoomResponse> getUserRooms(String userId) {
        return roomRepository.findRoomsByUserId(userId).stream()
            .map(r -> toChatRoomResponse(r, userId)).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public ChatRoomResponse getRoomById(String roomId, String userId) {
        ChatRoom room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        validateMember(room, userId);
        return toChatRoomResponse(room, userId);
    }

    @Override @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, String userId) {
        User sender = getUser(userId);
        ChatRoom room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        validateMember(room, userId);

        Message message = Message.builder()
            .content(request.getContent()).type(request.getType())
            .sender(sender).room(room)
            .fileUrl(request.getFileUrl()).fileName(request.getFileName()).build();

        if (request.getReplyToId() != null) {
            messageRepository.findById(request.getReplyToId()).ifPresent(message::setReplyTo);
        }
        message = messageRepository.save(message);
        roomRepository.save(room);

        MessageResponse response = toMessageResponse(message);
        messagingTemplate.convertAndSend("/topic/room/" + request.getRoomId(), response);
        return response;
    }

    @Override @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(String roomId, int page, int size) {
        return messageRepository.findByRoomId(roomId,
            PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .getContent().stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override @Transactional
    public MessageResponse editMessage(String messageId, String content, String userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        if (!message.getSender().getId().equals(userId))
            throw new UnauthorizedException("Cannot edit another user message");
        message.setContent(content);
        message.setEdited(true);
        message = messageRepository.save(message);
        MessageResponse response = toMessageResponse(message);
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoom().getId() + "/edits", response);
        return response;
    }

    @Override @Transactional
    public void deleteMessage(String messageId, String userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        if (!message.getSender().getId().equals(userId))
            throw new UnauthorizedException("Cannot delete another user message");
        message.setDeleted(true);
        message.setContent("[Message deleted]");
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/room/" + message.getRoom().getId() + "/deletes", messageId);
    }

    @Override @Transactional
    public void addMember(String roomId, String userId, String requesterId) {
        ChatRoom room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        User user = getUser(userId);
        room.getMembers().add(user);
        roomRepository.save(room);
    }

    @Override @Transactional
    public void removeMember(String roomId, String userId, String requesterId) {
        ChatRoom room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        room.getMembers().removeIf(m -> m.getId().equals(userId));
        roomRepository.save(room);
    }

    private void validateMember(ChatRoom room, String userId) {
        boolean isMember = room.getMembers().stream().anyMatch(m -> m.getId().equals(userId));
        if (!isMember) throw new UnauthorizedException("Not a member of this room");
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId()).username(user.getUsername())
            .displayName(user.getDisplayName()).avatarUrl(user.getAvatarUrl())
            .status(user.getStatus()).lastSeen(user.getLastSeen()).build();
    }

    private MessageResponse toMessageResponse(Message m) {
        return MessageResponse.builder()
            .id(m.getId()).content(m.getContent()).type(m.getType())
            .sender(toUserResponse(m.getSender())).roomId(m.getRoom().getId())
            .replyToId(m.getReplyTo() != null ? m.getReplyTo().getId() : null)
            .fileUrl(m.getFileUrl()).fileName(m.getFileName())
            .edited(m.isEdited()).deleted(m.isDeleted())
            .reactions(m.getReactions()).createdAt(m.getCreatedAt()).updatedAt(m.getUpdatedAt()).build();
    }

    private ChatRoomResponse toChatRoomResponse(ChatRoom room, String userId) {
        List<Message> msgs = messageRepository.findByRoomId(room.getId(),
            PageRequest.of(0, 1, Sort.by("createdAt").descending())).getContent();
        MessageResponse lastMsg = msgs.isEmpty() ? null : toMessageResponse(msgs.get(0));

        String name = room.getType() == RoomType.DIRECT
            ? room.getMembers().stream().filter(m -> !m.getId().equals(userId))
                .findFirst().map(User::getDisplayName).orElse(room.getName())
            : room.getName();

        String avatarUrl = room.getType() == RoomType.DIRECT
            ? room.getMembers().stream().filter(m -> !m.getId().equals(userId))
                .findFirst().map(User::getAvatarUrl).orElse(null)
            : room.getAvatarUrl();

        return ChatRoomResponse.builder()
            .id(room.getId()).name(name).description(room.getDescription())
            .type(room.getType()).avatarUrl(avatarUrl)
            .members(room.getMembers().stream().map(this::toUserResponse).collect(Collectors.toList()))
            .createdBy(room.getCreatedBy() != null ? toUserResponse(room.getCreatedBy()) : null)
            .lastMessage(lastMsg).createdAt(room.getCreatedAt()).updatedAt(room.getUpdatedAt()).build();
    }
}
