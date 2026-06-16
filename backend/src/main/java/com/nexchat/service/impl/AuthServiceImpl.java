package com.nexchat.service.impl;

import com.nexchat.dto.request.LoginRequest;
import com.nexchat.dto.request.RegisterRequest;
import com.nexchat.dto.response.AuthResponse;
import com.nexchat.dto.response.UserResponse;
import com.nexchat.entity.User;
import com.nexchat.enums.UserStatus;
import com.nexchat.exception.DuplicateResourceException;
import com.nexchat.exception.ResourceNotFoundException;
import com.nexchat.repository.UserRepository;
import com.nexchat.service.AuthService;
import com.nexchat.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil, AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
    }

    @Override @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already registered");
        if (userRepository.existsByUsername(request.getUsername()))
            throw new DuplicateResourceException("Username already taken");

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .displayName(request.getDisplayName() != null ? request.getDisplayName() : request.getUsername())
            .status(UserStatus.ONLINE)
            .build();
        user = userRepository.save(user);

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        user.setRefreshToken(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        return AuthResponse.builder().accessToken(accessToken).refreshToken(refreshToken).user(toUserResponse(user)).build();
    }

    @Override @Transactional
    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
            request.getUsernameOrEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getUsernameOrEmail())
            .or(() -> userRepository.findByUsername(request.getUsernameOrEmail()))
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setStatus(UserStatus.ONLINE);
        user.setLastSeen(LocalDateTime.now());

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        user.setRefreshToken(passwordEncoder.encode(refreshToken));
        userRepository.save(user);

        return AuthResponse.builder().accessToken(accessToken).refreshToken(refreshToken).user(toUserResponse(user)).build();
    }

    @Override @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!jwtUtil.isTokenValid(refreshToken, user)) throw new RuntimeException("Invalid refresh token");

        String newAccessToken = jwtUtil.generateToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);
        user.setRefreshToken(passwordEncoder.encode(newRefreshToken));
        userRepository.save(user);

        return AuthResponse.builder().accessToken(newAccessToken).refreshToken(newRefreshToken).user(toUserResponse(user)).build();
    }

    @Override @Transactional
    public void logout(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setStatus(UserStatus.OFFLINE);
            user.setLastSeen(LocalDateTime.now());
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId()).username(user.getUsername()).email(user.getEmail())
            .displayName(user.getDisplayName()).avatarUrl(user.getAvatarUrl())
            .bio(user.getBio()).status(user.getStatus())
            .lastSeen(user.getLastSeen()).createdAt(user.getCreatedAt()).build();
    }
}
