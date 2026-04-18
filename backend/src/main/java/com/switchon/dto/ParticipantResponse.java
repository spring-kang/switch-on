package com.switchon.dto;

import com.switchon.entity.ChallengeParticipant;
import com.switchon.entity.ChallengeParticipant.DepositStatus;
import com.switchon.entity.ChallengeParticipant.ParticipantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class ParticipantResponse {

  private Long id;
  private Long userId;
  private String nickname;
  private BigDecimal depositAmount;
  private DepositStatus depositStatus;
  private ParticipantStatus status;
  private Integer achievementRate;
  private LocalDateTime joinedAt;

  public static ParticipantResponse from(ChallengeParticipant participant) {
    return ParticipantResponse.builder()
      .id(participant.getId())
      .userId(participant.getUser().getId())
      .nickname(participant.getUser().getNickname())
      .depositAmount(participant.getDepositAmount())
      .depositStatus(participant.getDepositStatus())
      .status(participant.getStatus())
      .achievementRate(participant.getAchievementRate())
      .joinedAt(participant.getJoinedAt())
      .build();
  }
}
