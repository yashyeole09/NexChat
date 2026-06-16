package com.nexchat.dto.response;

import com.nexchat.enums.MessageType;
import java.time.LocalDateTime;
import java.util.List;

public class MessageResponse {
    private String id, content, roomId, replyToId, fileUrl, fileName;
    private MessageType type;
    private UserResponse sender;
    private boolean edited, deleted;
    private List<String> reactions;
    private LocalDateTime createdAt, updatedAt;

    public String getId() { return id; }
    public void setId(String v) { this.id=v; }
    public String getContent() { return content; }
    public void setContent(String v) { this.content=v; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String v) { this.roomId=v; }
    public String getReplyToId() { return replyToId; }
    public void setReplyToId(String v) { this.replyToId=v; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String v) { this.fileUrl=v; }
    public String getFileName() { return fileName; }
    public void setFileName(String v) { this.fileName=v; }
    public MessageType getType() { return type; }
    public void setType(MessageType v) { this.type=v; }
    public UserResponse getSender() { return sender; }
    public void setSender(UserResponse v) { this.sender=v; }
    public boolean isEdited() { return edited; }
    public void setEdited(boolean v) { this.edited=v; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean v) { this.deleted=v; }
    public List<String> getReactions() { return reactions; }
    public void setReactions(List<String> v) { this.reactions=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt=v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final MessageResponse r = new MessageResponse();
        public Builder id(String v) { r.id=v; return this; }
        public Builder content(String v) { r.content=v; return this; }
        public Builder roomId(String v) { r.roomId=v; return this; }
        public Builder replyToId(String v) { r.replyToId=v; return this; }
        public Builder fileUrl(String v) { r.fileUrl=v; return this; }
        public Builder fileName(String v) { r.fileName=v; return this; }
        public Builder type(MessageType v) { r.type=v; return this; }
        public Builder sender(UserResponse v) { r.sender=v; return this; }
        public Builder edited(boolean v) { r.edited=v; return this; }
        public Builder deleted(boolean v) { r.deleted=v; return this; }
        public Builder reactions(List<String> v) { r.reactions=v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt=v; return this; }
        public Builder updatedAt(LocalDateTime v) { r.updatedAt=v; return this; }
        public MessageResponse build() { return r; }
    }
}
