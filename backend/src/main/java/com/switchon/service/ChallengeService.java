package com.switchon.service;

import com.switchon.dto.*;
import com.switchon.entity.Challenge;
import com.switchon.entity.Challenge.ChallengeStatus;
import com.switchon.entity.ChallengeParticipant;
import com.switchon.entity.ChallengeParticipant.DepositStatus;
import com.switchon.entity.User;
import com.switchon.repository.ChallengeParticipantRepository;
import com.switchon.repository.ChallengeRepository;
import com.switchon.repository.MissionRepository;
import com.switchon.repository.UserRepository;
import com.switchon.entity.Mission;
import com.switchon.entity.Mission.MissionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {

  private final ChallengeRepository challengeRepository;
  private final ChallengeParticipantRepository participantRepository;
  private final UserRepository userRepository;
  private final MissionRepository missionRepository;

  // 챌린지 생성
  @Transactional
  public ChallengeResponse createChallenge(Long userId, CreateChallengeRequest request) {
    User creator = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    if (request.getEndDate().isBefore(request.getStartDate())) {
      throw new IllegalArgumentException("종료일은 시작일 이후여야 합니다");
    }

    Challenge challenge = Challenge.builder()
      .title(request.getTitle())
      .description(request.getDescription())
      .startDate(request.getStartDate())
      .endDate(request.getEndDate())
      .maxParticipants(request.getMaxParticipants())
      .depositAmount(request.getDepositAmount())
      .creator(creator)
      .status(ChallengeStatus.RECRUITING)
      .build();

    challengeRepository.save(challenge);

    // 기본 미션 생성
    createDefaultMissions(challenge);

    return ChallengeResponse.from(challenge, false);
  }

  // 기본 미션 생성
  private void createDefaultMissions(Challenge challenge) {
    // 간헐적 단식 미션
    Mission fastingMission = Mission.builder()
      .challenge(challenge)
      .title("간헐적 단식 16:8")
      .description("16시간 단식, 8시간 식사 타임을 지켜주세요")
      .type(MissionType.FASTING)
      .fastingHours(16)
      .eatingWindowStart("12:00")
      .eatingWindowEnd("20:00")
      .isActive(true)
      .build();

    // 식단 인증 미션
    Mission mealLogMission = Mission.builder()
      .challenge(challenge)
      .title("식단 인증")
      .description("오늘 먹은 식사를 사진으로 인증해주세요")
      .type(MissionType.MEAL_LOG)
      .requiredMeals(3)
      .isActive(true)
      .build();

    missionRepository.save(fastingMission);
    missionRepository.save(mealLogMission);
  }

  // 챌린지 목록 조회 (모집중)
  @Transactional(readOnly = true)
  public List<ChallengeResponse> getRecruitingChallenges(Long userId) {
    List<Challenge> challenges = challengeRepository.findByStatusOrderByStartDateAsc(ChallengeStatus.RECRUITING);

    return challenges.stream()
      .map(c -> {
        boolean isParticipating = userId != null &&
          participantRepository.existsByChallengeIdAndUserId(c.getId(), userId);
        return ChallengeResponse.from(c, isParticipating);
      })
      .collect(Collectors.toList());
  }

  // 챌린지 상세 조회
  @Transactional(readOnly = true)
  public ChallengeResponse getChallenge(Long challengeId, Long userId) {
    Challenge challenge = challengeRepository.findById(challengeId)
      .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다"));

    boolean isParticipating = userId != null &&
      participantRepository.existsByChallengeIdAndUserId(challengeId, userId);

    return ChallengeResponse.from(challenge, isParticipating);
  }

  // 챌린지 참가 (디파짓 결제 Mock)
  @Transactional
  public ParticipantResponse joinChallenge(Long challengeId, Long userId, JoinChallengeRequest request) {
    Challenge challenge = challengeRepository.findById(challengeId)
      .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다"));

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    // 이미 참가중인지 확인
    if (participantRepository.existsByChallengeIdAndUserId(challengeId, userId)) {
      throw new IllegalArgumentException("이미 참가중인 챌린지입니다");
    }

    // 참가 가능 여부 확인
    if (!challenge.canJoin()) {
      throw new IllegalArgumentException("참가할 수 없는 챌린지입니다");
    }

    // Mock 결제 처리
    DepositStatus depositStatus = processPayment(request);

    ChallengeParticipant participant = ChallengeParticipant.builder()
      .challenge(challenge)
      .user(user)
      .depositAmount(challenge.getDepositAmount())
      .depositStatus(depositStatus)
      .build();

    participantRepository.save(participant);
    challenge.getParticipants().add(participant);

    return ParticipantResponse.from(participant);
  }

  // 챌린지 탈퇴
  @Transactional
  public void leaveChallenge(Long challengeId, Long userId) {
    ChallengeParticipant participant = participantRepository
      .findByChallengeIdAndUserId(challengeId, userId)
      .orElseThrow(() -> new IllegalArgumentException("참가 정보를 찾을 수 없습니다"));

    Challenge challenge = participant.getChallenge();

    // 시작 전에만 탈퇴 가능
    if (challenge.getStatus() != ChallengeStatus.RECRUITING) {
      throw new IllegalArgumentException("진행중인 챌린지는 탈퇴할 수 없습니다");
    }

    // Mock 환불 처리
    participant.setDepositStatus(DepositStatus.REFUNDED);
    participant.setStatus(ChallengeParticipant.ParticipantStatus.WITHDRAWN);

    challenge.getParticipants().remove(participant);
    participantRepository.delete(participant);
  }

  // 참가자 목록 조회
  @Transactional(readOnly = true)
  public List<ParticipantResponse> getParticipants(Long challengeId) {
    List<ChallengeParticipant> participants = participantRepository.findByChallengeId(challengeId);
    return participants.stream()
      .map(ParticipantResponse::from)
      .collect(Collectors.toList());
  }

  // 내가 참가한 챌린지 목록
  @Transactional(readOnly = true)
  public List<ChallengeResponse> getMyChallenges(Long userId) {
    List<Challenge> challenges = challengeRepository.findByParticipantUserId(userId);
    return challenges.stream()
      .map(c -> ChallengeResponse.from(c, true))
      .collect(Collectors.toList());
  }

  // Mock 결제 처리
  private DepositStatus processPayment(JoinChallengeRequest request) {
    // 실제로는 PG사 연동하여 결제 처리
    // 지금은 항상 성공으로 처리
    return DepositStatus.PAID;
  }
}
