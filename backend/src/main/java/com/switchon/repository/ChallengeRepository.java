package com.switchon.repository;

import com.switchon.entity.Challenge;
import com.switchon.entity.Challenge.ChallengeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

  List<Challenge> findByStatusOrderByStartDateAsc(ChallengeStatus status);

  List<Challenge> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);

  @Query("SELECT c FROM Challenge c WHERE c.status = :status ORDER BY c.startDate ASC")
  List<Challenge> findRecruitingChallenges(@Param("status") ChallengeStatus status);

  @Query("SELECT c FROM Challenge c JOIN c.participants p WHERE p.user.id = :userId")
  List<Challenge> findByParticipantUserId(@Param("userId") Long userId);
}
