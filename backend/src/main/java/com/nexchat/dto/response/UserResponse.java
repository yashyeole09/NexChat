package com.nexchat.dto.response;

import com.nexchat.enums.UserStatus;
import java.time.LocalDateTime;

public class UserResponse {
    private String id, username, email, displayName, avatarUrl, bio;
    private UserStatus status;
    private LocalDateTime lastSeen, createdAt;

    public String getId() { return id; }
    public void setId(String v) { this.id=v; }
    public String getUsername() { return username; }
    public void setUsername(String v) { this.username=v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email=v; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String v) { this.displayName=v; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String v) { this.avatarUrl=v; }
    public String getBio() { return bio; }
    public void setBio(String v) { this.bio=v; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus v) { this.status=v; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime v) { this.lastSeen=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final UserResponse r = new UserResponse();
        public Builder id(String v) { r.id=v; return this; }
        public Builder username(String v) { r.username=v; return this; }
        public Builder email(String v) { r.email=v; return this; }
        public Builder displayName(String v) { r.displayName=v; return this; }
        public Builder avatarUrl(String v) { r.avatarUrl=v; return this; }
        public Builder bio(String v) { r.bio=v; return this; }
        public Builder status(UserStatus v) { r.status=v; return this; }
        public Builder lastSeen(LocalDateTime v) { r.lastSeen=v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt=v; return this; }
        public UserResponse build() { return r; }
    }
}
