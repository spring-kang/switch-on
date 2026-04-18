package com.switchon.repository;

import com.switchon.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

  List<Mission> findByChallengeIdAndIsActiveTrue(Long challengeId);

  List<Mission> findByChallengeId(Long challengeId);
}
