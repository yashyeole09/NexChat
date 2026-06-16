package com.nexchat.dto.response;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserResponse user;

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String v) { this.accessToken=v; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String v) { this.refreshToken=v; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String v) { this.tokenType=v; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse v) { this.user=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AuthResponse r = new AuthResponse();
        public Builder accessToken(String v) { r.accessToken=v; return this; }
        public Builder refreshToken(String v) { r.refreshToken=v; return this; }
        public Builder tokenType(String v) { r.tokenType=v; return this; }
        public Builder user(UserResponse v) { r.user=v; return this; }
        public AuthResponse build() { return r; }
    }
}
