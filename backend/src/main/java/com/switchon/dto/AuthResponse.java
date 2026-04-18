package com.switchon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class AuthResponse {

  private String accessToken;
  private String tokenType;
  private UserInfo user;

  @Getter
  @AllArgsConstructor
  @Builder
  public static class UserInfo {
    private Long id;
    private String email;
    private String nickname;
    private String profileImage;
  }

  public static AuthResponse of(String accessToken, UserInfo user) {
    return AuthResponse.builder()
      .accessToken(accessToken)
      .tokenType("Bearer")
      .user(user)
      .build();
  }
}
