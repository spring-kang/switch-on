package com.switchon.service;

import com.switchon.dto.AuthResponse;
import com.switchon.dto.LoginRequest;
import com.switchon.dto.SignUpRequest;
import com.switchon.entity.User;
import com.switchon.repository.UserRepository;
import com.switchon.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  // 회원가입
  @Transactional
  public AuthResponse signUp(SignUpRequest request) {
    // 이메일 중복 확인
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("이미 사용중인 이메일입니다");
    }

    // 닉네임 중복 확인
    if (userRepository.existsByNickname(request.getNickname())) {
      throw new IllegalArgumentException("이미 사용중인 닉네임입니다");
    }

    // 사용자 생성
    User user = User.builder()
      .email(request.getEmail())
      .password(passwordEncoder.encode(request.getPassword()))
      .nickname(request.getNickname())
      .role(User.Role.USER)
      .build();

    userRepository.save(user);

    // 토큰 생성
    String token = jwtTokenProvider.createToken(
      user.getId(),
      user.getEmail(),
      user.getRole().name()
    );

    return AuthResponse.of(token, toUserInfo(user));
  }

  // 로그인
  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    // 사용자 조회
    User user = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다"));

    // 비밀번호 확인
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다");
    }

    // 토큰 생성
    String token = jwtTokenProvider.createToken(
      user.getId(),
      user.getEmail(),
      user.getRole().name()
    );

    return AuthResponse.of(token, toUserInfo(user));
  }

  // 현재 사용자 정보 조회
  @Transactional(readOnly = true)
  public AuthResponse.UserInfo getCurrentUser(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    return toUserInfo(user);
  }

  private AuthResponse.UserInfo toUserInfo(User user) {
    return AuthResponse.UserInfo.builder()
      .id(user.getId())
      .email(user.getEmail())
      .nickname(user.getNickname())
      .profileImage(user.getProfileImage())
      .build();
  }
}
