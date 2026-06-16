package com.nexchat.dto.response;

import com.nexchat.enums.RoomType;
import java.time.LocalDateTime;
import java.util.List;

public class ChatRoomResponse {
    private String id, name, description, avatarUrl;
    private RoomType type;
    private List<UserResponse> members;
    private UserResponse createdBy;
    private MessageResponse lastMessage;
    private long unreadCount;
    private LocalDateTime createdAt, updatedAt;

    public String getId() { return id; }
    public void setId(String v) { this.id=v; }
    public String getName() { return name; }
    public void setName(String v) { this.name=v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description=v; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String v) { this.avatarUrl=v; }
    public RoomType getType() { return type; }
    public void setType(RoomType v) { this.type=v; }
    public List<UserResponse> getMembers() { return members; }
    public void setMembers(List<UserResponse> v) { this.members=v; }
    public UserResponse getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponse v) { this.createdBy=v; }
    public MessageResponse getLastMessage() { return lastMessage; }
    public void setLastMessage(MessageResponse v) { this.lastMessage=v; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long v) { this.unreadCount=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt=v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final ChatRoomResponse r = new ChatRoomResponse();
        public Builder id(String v) { r.id=v; return this; }
        public Builder name(String v) { r.name=v; return this; }
        public Builder description(String v) { r.description=v; return this; }
        public Builder avatarUrl(String v) { r.avatarUrl=v; return this; }
        public Builder type(RoomType v) { r.type=v; return this; }
        public Builder members(List<UserResponse> v) { r.members=v; return this; }
        public Builder createdBy(UserResponse v) { r.createdBy=v; return this; }
        public Builder lastMessage(MessageResponse v) { r.lastMessage=v; return this; }
        public Builder unreadCount(long v) { r.unreadCount=v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { r.updatedAt=v; return this; }
        public ChatRoomResponse build() { return r; }
    }
}
