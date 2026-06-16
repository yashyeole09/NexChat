package com.nexchat.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank @Size(min=3,max=50) private String username;
    @Email @NotBlank private String email;
    @NotBlank @Size(min=6,max=100) private String password;
    private String displayName;

    public String getUsername() { return username; }
    public void setUsername(String v) { this.username=v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email=v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password=v; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String v) { this.displayName=v; }
}
