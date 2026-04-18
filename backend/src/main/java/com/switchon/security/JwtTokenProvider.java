package com.switchon.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secretString;

  @Value("${jwt.expiration}")
  private long expirationTime;

  private SecretKey secretKey;

  @PostConstruct
  protected void init() {
    this.secretKey = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
  }

  // 토큰 생성
  public String createToken(Long userId, String email, String role) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expirationTime);

    return Jwts.builder()
      .subject(String.valueOf(userId))
      .claim("email", email)
      .claim("role", role)
      .issuedAt(now)
      .expiration(expiryDate)
      .signWith(secretKey)
      .compact();
  }

  // 토큰에서 사용자 ID 추출
  public Long getUserIdFromToken(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token)
      .getPayload();

    return Long.parseLong(claims.getSubject());
  }

  // 토큰에서 이메일 추출
  public String getEmailFromToken(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token)
      .getPayload();

    return claims.get("email", String.class);
  }

  // 토큰에서 Authentication 객체 생성
  public Authentication getAuthentication(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token)
      .getPayload();

    String role = claims.get("role", String.class);
    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

    User principal = new User(
      claims.getSubject(),
      "",
      Collections.singletonList(authority)
    );

    return new UsernamePasswordAuthenticationToken(principal, token, Collections.singletonList(authority));
  }

  // 토큰 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token);
      return true;
    } catch (SecurityException | MalformedJwtException e) {
      log.error("잘못된 JWT 서명입니다: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      log.error("만료된 JWT 토큰입니다: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      log.error("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      log.error("JWT 토큰이 비어있습니다: {}", e.getMessage());
    }
    return false;
  }
}
