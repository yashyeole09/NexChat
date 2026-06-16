package com.nexchat.entity;

import com.nexchat.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_username", columnList = "username", unique = true)
})
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank @Size(min = 3, max = 50)
    @Column(unique = true, nullable = false)
    private String username;

    @Email @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank @Column(nullable = false)
    private String password;

    @Column(name = "display_name") private String displayName;
    @Column(name = "avatar_url") private String avatarUrl;
    @Column(columnDefinition = "TEXT") private String bio;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.OFFLINE;

    @Column(name = "last_seen") private LocalDateTime lastSeen;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") private LocalDateTime updatedAt = LocalDateTime.now();
    @Column(name = "is_active") private boolean active = true;
    @Column(name = "refresh_token") private String refreshToken;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> roles = new ArrayList<>(List.of("ROLE_USER"));

    @ManyToMany(mappedBy = "members")
    private Set<ChatRoom> rooms = new HashSet<>();

    @PreUpdate protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    @Override public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    @Override public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String v) { this.displayName = v; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String v) { this.avatarUrl = v; }
    public String getBio() { return bio; }
    public void setBio(String v) { this.bio = v; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus v) { this.status = v; }
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime v) { this.lastSeen = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String v) { this.refreshToken = v; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> v) { this.roles = v; }
    public Set<ChatRoom> getRooms() { return rooms; }
    public void setRooms(Set<ChatRoom> v) { this.rooms = v; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(SimpleGrantedAuthority::new).toList();
    }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User u = new User();
        public Builder username(String v) { u.username=v; return this; }
        public Builder email(String v) { u.email=v; return this; }
        public Builder password(String v) { u.password=v; return this; }
        public Builder displayName(String v) { u.displayName=v; return this; }
        public Builder avatarUrl(String v) { u.avatarUrl=v; return this; }
        public Builder bio(String v) { u.bio=v; return this; }
        public Builder status(UserStatus v) { u.status=v; return this; }
        public Builder active(boolean v) { u.active=v; return this; }
        public Builder roles(List<String> v) { u.roles=v; return this; }
        public User build() { return u; }
    }
}
