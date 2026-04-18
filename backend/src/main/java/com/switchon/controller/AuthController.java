package com.switchon.controller;

import com.switchon.dto.AuthResponse;
import com.switchon.dto.LoginRequest;
import com.switchon.dto.SignUpRequest;
import com.switchon.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  // 회원가입
  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
    AuthResponse response = authService.signUp(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    AuthResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }

  // 현재 사용자 정보 조회
  @GetMapping("/me")
  public ResponseEntity<AuthResponse.UserInfo> getCurrentUser(
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    AuthResponse.UserInfo userInfo = authService.getCurrentUser(userId);
    return ResponseEntity.ok(userInfo);
  }

  // 예외 처리
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
  }
}
