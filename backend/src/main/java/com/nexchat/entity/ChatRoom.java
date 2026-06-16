package com.nexchat.entity;

import com.nexchat.enums.RoomType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false) private String name;
    @Column(columnDefinition = "TEXT") private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type = RoomType.GROUP;

    @Column(name = "avatar_url") private String avatarUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "room_members",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public String getId() { return id; }
    public void setId(String v) { this.id=v; }
    public String getName() { return name; }
    public void setName(String v) { this.name=v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description=v; }
    public RoomType getType() { return type; }
    public void setType(RoomType v) { this.type=v; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String v) { this.avatarUrl=v; }
    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> v) { this.members=v; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User v) { this.createdBy=v; }
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> v) { this.messages=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt=v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final ChatRoom r = new ChatRoom();
        public Builder name(String v) { r.name=v; return this; }
        public Builder description(String v) { r.description=v; return this; }
        public Builder type(RoomType v) { r.type=v; return this; }
        public Builder avatarUrl(String v) { r.avatarUrl=v; return this; }
        public Builder members(Set<User> v) { r.members=v; return this; }
        public Builder createdBy(User v) { r.createdBy=v; return this; }
        public ChatRoom build() { return r; }
    }
}
