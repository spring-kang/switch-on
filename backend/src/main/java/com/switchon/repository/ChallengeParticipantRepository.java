package com.switchon.repository;

import com.switchon.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {

  Optional<ChallengeParticipant> findByChallengeIdAndUserId(Long challengeId, Long userId);

  List<ChallengeParticipant> findByChallengeId(Long challengeId);

  List<ChallengeParticipant> findByUserId(Long userId);

  boolean existsByChallengeIdAndUserId(Long challengeId, Long userId);
}
