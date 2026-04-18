package com.switchon.service;

import com.switchon.dto.*;
import com.switchon.entity.*;
import com.switchon.entity.Mission.MissionType;
import com.switchon.entity.MissionCompletion.MealType;
import com.switchon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MissionService {

  private final MissionRepository missionRepository;
  private final MissionCompletionRepository completionRepository;
  private final ChallengeRepository challengeRepository;
  private final ChallengeParticipantRepository participantRepository;
  private final UserRepository userRepository;

  // 챌린지 생성 시 기본 미션 생성
  @Transactional
  public void createDefaultMissions(Challenge challenge) {
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

  // 챌린지의 미션 목록 조회
  @Transactional(readOnly = true)
  public List<MissionResponse> getMissions(Long challengeId, Long userId) {
    List<Mission> missions = missionRepository.findByChallengeIdAndIsActiveTrue(challengeId);
    LocalDate today = LocalDate.now();

    return missions.stream()
      .map(mission -> {
        boolean completedToday = false;
        int completedMealsToday = 0;

        if (userId != null) {
          if (mission.getType() == MissionType.FASTING) {
            completedToday = completionRepository.existsByMissionIdAndUserIdAndCompletionDate(
              mission.getId(), userId, today);
          } else if (mission.getType() == MissionType.MEAL_LOG) {
            List<MissionCompletion> mealLogs = completionRepository.findMealLogsByDate(
              mission.getId(), userId, today);
            completedMealsToday = mealLogs.size();
            completedToday = completedMealsToday >= mission.getRequiredMeals();
          }
        }

        return MissionResponse.from(mission, completedToday, completedMealsToday);
      })
      .collect(Collectors.toList());
  }

  // 오늘의 미션 상태 조회
  @Transactional(readOnly = true)
  public DailyMissionStatus getTodayMissionStatus(Long challengeId, Long userId) {
    List<MissionResponse> missions = getMissions(challengeId, userId);
    return DailyMissionStatus.of(LocalDate.now(), missions);
  }

  // 미션 완료 처리
  @Transactional
  public MissionCompletionResponse completeMission(Long missionId, Long userId, CompleteMissionRequest request) {
    Mission mission = missionRepository.findById(missionId)
      .orElseThrow(() -> new IllegalArgumentException("미션을 찾을 수 없습니다"));

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

    // 챌린지 참가자인지 확인
    if (!participantRepository.existsByChallengeIdAndUserId(mission.getChallenge().getId(), userId)) {
      throw new IllegalArgumentException("챌린지에 참가하지 않았습니다");
    }

    LocalDate today = LocalDate.now();

    // 간헐적 단식은 하루에 한 번만
    if (mission.getType() == MissionType.FASTING) {
      if (completionRepository.existsByMissionIdAndUserIdAndCompletionDate(missionId, userId, today)) {
        throw new IllegalArgumentException("오늘 이미 단식 미션을 완료했습니다");
      }
    }

    // 식단 인증은 같은 mealType 중복 체크
    if (mission.getType() == MissionType.MEAL_LOG && request.getMealType() != null) {
      List<MissionCompletion> todayMeals = completionRepository.findMealLogsByDate(missionId, userId, today);
      boolean alreadyLogged = todayMeals.stream()
        .anyMatch(m -> m.getMealType() == request.getMealType());
      if (alreadyLogged) {
        throw new IllegalArgumentException("이미 해당 식사를 인증했습니다");
      }
    }

    MissionCompletion completion = MissionCompletion.builder()
      .mission(mission)
      .user(user)
      .completionDate(today)
      .imageUrl(request.getImageUrl())
      .note(request.getNote())
      .mealType(request.getMealType())
      .build();

    completionRepository.save(completion);

    return MissionCompletionResponse.from(completion);
  }

  // 기간별 미션 완료 현황 (히트맵용)
  @Transactional(readOnly = true)
  public List<DailyMissionStatus> getMissionHistory(Long challengeId, Long userId, LocalDate startDate, LocalDate endDate) {
    List<Mission> missions = missionRepository.findByChallengeIdAndIsActiveTrue(challengeId);
    List<MissionCompletion> completions = completionRepository.findByUserIdAndCompletionDateBetween(userId, startDate, endDate);

    List<DailyMissionStatus> history = new ArrayList<>();

    for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
      final LocalDate currentDate = date;
      List<MissionResponse> dailyMissions = missions.stream()
        .map(mission -> {
          boolean completed = false;
          int completedMeals = 0;

          if (mission.getType() == MissionType.FASTING) {
            completed = completions.stream()
              .anyMatch(c -> c.getMission().getId().equals(mission.getId()) &&
                c.getCompletionDate().equals(currentDate));
          } else if (mission.getType() == MissionType.MEAL_LOG) {
            completedMeals = (int) completions.stream()
              .filter(c -> c.getMission().getId().equals(mission.getId()) &&
                c.getCompletionDate().equals(currentDate) &&
                c.getMealType() != null)
              .count();
            completed = completedMeals >= mission.getRequiredMeals();
          }

          return MissionResponse.from(mission, completed, completedMeals);
        })
        .collect(Collectors.toList());

      history.add(DailyMissionStatus.of(currentDate, dailyMissions));
    }

    return history;
  }

  // 오늘의 미션 완료 목록 조회
  @Transactional(readOnly = true)
  public List<MissionCompletionResponse> getTodayCompletions(Long challengeId, Long userId) {
    List<MissionCompletion> completions = completionRepository.findByChallengeIdAndUserId(challengeId, userId);
    LocalDate today = LocalDate.now();

    return completions.stream()
      .filter(c -> c.getCompletionDate().equals(today))
      .map(MissionCompletionResponse::from)
      .collect(Collectors.toList());
  }
}
