package com.nexchat.service;

import com.nexchat.dto.request.LoginRequest;
import com.nexchat.dto.request.RegisterRequest;
import com.nexchat.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String userId);
}
