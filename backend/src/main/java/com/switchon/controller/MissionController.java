package com.switchon.controller;

import com.switchon.dto.*;
import com.switchon.service.MissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges/{challengeId}/missions")
@RequiredArgsConstructor
public class MissionController {

  private final MissionService missionService;

  // 챌린지의 미션 목록 조회
  @GetMapping
  public ResponseEntity<List<MissionResponse>> getMissions(
    @PathVariable Long challengeId,
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = userDetails != null ? Long.parseLong(userDetails.getUsername()) : null;
    List<MissionResponse> missions = missionService.getMissions(challengeId, userId);
    return ResponseEntity.ok(missions);
  }

  // 오늘의 미션 상태 조회
  @GetMapping("/today")
  public ResponseEntity<DailyMissionStatus> getTodayStatus(
    @PathVariable Long challengeId,
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    DailyMissionStatus status = missionService.getTodayMissionStatus(challengeId, userId);
    return ResponseEntity.ok(status);
  }

  // 미션 완료 처리
  @PostMapping("/{missionId}/complete")
  public ResponseEntity<MissionCompletionResponse> completeMission(
    @PathVariable Long challengeId,
    @PathVariable Long missionId,
    @AuthenticationPrincipal UserDetails userDetails,
    @RequestBody(required = false) CompleteMissionRequest request
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    if (request == null) {
      request = new CompleteMissionRequest();
    }
    MissionCompletionResponse response = missionService.completeMission(missionId, userId, request);
    return ResponseEntity.ok(response);
  }

  // 오늘의 완료 목록
  @GetMapping("/completions/today")
  public ResponseEntity<List<MissionCompletionResponse>> getTodayCompletions(
    @PathVariable Long challengeId,
    @AuthenticationPrincipal UserDetails userDetails
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    List<MissionCompletionResponse> completions = missionService.getTodayCompletions(challengeId, userId);
    return ResponseEntity.ok(completions);
  }

  // 기간별 미션 히스토리 (히트맵용)
  @GetMapping("/history")
  public ResponseEntity<List<DailyMissionStatus>> getMissionHistory(
    @PathVariable Long challengeId,
    @AuthenticationPrincipal UserDetails userDetails,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
  ) {
    Long userId = Long.parseLong(userDetails.getUsername());
    List<DailyMissionStatus> history = missionService.getMissionHistory(challengeId, userId, startDate, endDate);
    return ResponseEntity.ok(history);
  }

  // 예외 처리
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
  }
}
