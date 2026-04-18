package com.switchon.controller;

import com.switchon.dto.*;
import com.switchon.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

  private final ChallengeService challengeService;

  // 챌린지 생성
  @PostMapping
  public ResponseEntity<ChallengeResponse> createChallenge(
    @AuthenticationPrincipal UserDetails userDetails,
    @Valid @RequestBody CreateChallengeRequest request
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    ChallengeResponse response = challengeService.createChallenge(userId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // 모집중인 챌린지 목록 조회
  @GetMapping
  public ResponseEntity<List<ChallengeResponse>> getChallenges(
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = userDetails != null ? Long.parseLong(userDetails.getUsername()) : null;
    List<ChallengeResponse> challenges = challengeService.getRecruitingChallenges(userId);
    return ResponseEntity.ok(challenges);
  }

  // 챌린지 상세 조회
  @GetMapping("/{id}")
  public ResponseEntity<ChallengeResponse> getChallenge(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = userDetails != null ? Long.parseLong(userDetails.getUsername()) : null;
    ChallengeResponse challenge = challengeService.getChallenge(id, userId);
    return ResponseEntity.ok(challenge);
  }

  // 챌린지 참가 (디파짓 결제)
  @PostMapping("/{id}/join")
  public ResponseEntity<ParticipantResponse> joinChallenge(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails,
    @RequestBody(required = false) JoinChallengeRequest request
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    if (request == null) {
      request = new JoinChallengeRequest();
      request.setPaymentMethod("MOCK");
    }
    ParticipantResponse response = challengeService.joinChallenge(id, userId, request);
    return ResponseEntity.ok(response);
  }

  // 챌린지 탈퇴
  @DeleteMapping("/{id}/leave")
  public ResponseEntity<Void> leaveChallenge(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    challengeService.leaveChallenge(id, userId);
    return ResponseEntity.noContent().build();
  }

  // 챌린지 참가자 목록
  @GetMapping("/{id}/participants")
  public ResponseEntity<List<ParticipantResponse>> getParticipants(@PathVariable Long id) {
    List<ParticipantResponse> participants = challengeService.getParticipants(id);
    return ResponseEntity.ok(participants);
  }

  // 내가 참가한 챌린지 목록
  @GetMapping("/my")
  public ResponseEntity<List<ChallengeResponse>> getMyChallenges(
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    List<ChallengeResponse> challenges = challengeService.getMyChallenges(userId);
    return ResponseEntity.ok(challenges);
  }

  // 예외 처리
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
  }
}
