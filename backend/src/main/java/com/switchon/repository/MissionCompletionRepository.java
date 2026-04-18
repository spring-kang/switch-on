package com.switchon.repository;

import com.switchon.entity.MissionCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MissionCompletionRepository extends JpaRepository<MissionCompletion, Long> {

  // 특정 날짜의 미션 완료 여부 확인
  boolean existsByMissionIdAndUserIdAndCompletionDate(Long missionId, Long userId, LocalDate date);

  // 특정 날짜의 미션 완료 목록
  List<MissionCompletion> findByMissionIdAndUserIdAndCompletionDate(Long missionId, Long userId, LocalDate date);

  // 사용자의 특정 기간 미션 완료 목록
  List<MissionCompletion> findByUserIdAndCompletionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

  // 챌린지의 특정 날짜 미션 완료 목록 (모든 사용자)
  @Query("SELECT mc FROM MissionCompletion mc WHERE mc.mission.challenge.id = :challengeId AND mc.completionDate = :date")
  List<MissionCompletion> findByChallengeIdAndDate(@Param("challengeId") Long challengeId, @Param("date") LocalDate date);

  // 사용자의 챌린지 미션 완료 목록
  @Query("SELECT mc FROM MissionCompletion mc WHERE mc.mission.challenge.id = :challengeId AND mc.user.id = :userId")
  List<MissionCompletion> findByChallengeIdAndUserId(@Param("challengeId") Long challengeId, @Param("userId") Long userId);

  // 특정 날짜에 사용자가 완료한 미션 수
  @Query("SELECT COUNT(DISTINCT mc.mission.id) FROM MissionCompletion mc " +
    "WHERE mc.mission.challenge.id = :challengeId AND mc.user.id = :userId AND mc.completionDate = :date")
  int countCompletedMissionsByDate(@Param("challengeId") Long challengeId, @Param("userId") Long userId, @Param("date") LocalDate date);

  // 특정 날짜의 식단 인증 목록 (mealType별)
  @Query("SELECT mc FROM MissionCompletion mc WHERE mc.mission.id = :missionId AND mc.user.id = :userId " +
    "AND mc.completionDate = :date AND mc.mealType IS NOT NULL")
  List<MissionCompletion> findMealLogsByDate(@Param("missionId") Long missionId, @Param("userId") Long userId, @Param("date") LocalDate date);
}
