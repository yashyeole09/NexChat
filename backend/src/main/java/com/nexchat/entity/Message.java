package com.nexchat.entity;

import com.nexchat.enums.MessageType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_message_room", columnList = "room_id"),
    @Index(name = "idx_message_sender", columnList = "sender_id"),
    @Index(name = "idx_message_created", columnList = "created_at")
})
public class Message {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT") private String content;

    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    @Column(name = "file_url") private String fileUrl;
    @Column(name = "file_name") private String fileName;
    @Column(name = "is_edited") private boolean edited = false;
    @Column(name = "is_deleted") private boolean deleted = false;

    @ElementCollection
    @CollectionTable(name = "message_reactions", joinColumns = @JoinColumn(name = "message_id"))
    private List<String> reactions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public String getId() { return id; }
    public void setId(String v) { this.id=v; }
    public String getContent() { return content; }
    public void setContent(String v) { this.content=v; }
    public MessageType getType() { return type; }
    public void setType(MessageType v) { this.type=v; }
    public User getSender() { return sender; }
    public void setSender(User v) { this.sender=v; }
    public ChatRoom getRoom() { return room; }
    public void setRoom(ChatRoom v) { this.room=v; }
    public Message getReplyTo() { return replyTo; }
    public void setReplyTo(Message v) { this.replyTo=v; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String v) { this.fileUrl=v; }
    public String getFileName() { return fileName; }
    public void setFileName(String v) { this.fileName=v; }
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
        private final Message m = new Message();
        public Builder content(String v) { m.content=v; return this; }
        public Builder type(MessageType v) { m.type=v; return this; }
        public Builder sender(User v) { m.sender=v; return this; }
        public Builder room(ChatRoom v) { m.room=v; return this; }
        public Builder replyTo(Message v) { m.replyTo=v; return this; }
        public Builder fileUrl(String v) { m.fileUrl=v; return this; }
        public Builder fileName(String v) { m.fileName=v; return this; }
        public Message build() { return m; }
    }
}
