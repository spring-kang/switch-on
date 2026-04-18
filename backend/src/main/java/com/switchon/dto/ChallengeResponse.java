package com.switchon.dto;

import com.switchon.entity.Challenge;
import com.switchon.entity.Challenge.ChallengeStatus;
import com.switchon.entity.Challenge.ChallengeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class ChallengeResponse {

  private Long id;
  private String title;
  private String description;
  private ChallengeType type;
  private LocalDate startDate;
  private LocalDate endDate;
  private Integer maxParticipants;
  private Integer currentParticipants;
  private BigDecimal depositAmount;
  private ChallengeStatus status;
  private CreatorInfo creator;
  private Boolean isParticipating;
  private LocalDateTime createdAt;

  @Getter
  @AllArgsConstructor
  @Builder
  public static class CreatorInfo {
    private Long id;
    private String nickname;
  }

  public static ChallengeResponse from(Challenge challenge, boolean isParticipating) {
    return ChallengeResponse.builder()
      .id(challenge.getId())
      .title(challenge.getTitle())
      .description(challenge.getDescription())
      .type(challenge.getType())
      .startDate(challenge.getStartDate())
      .endDate(challenge.getEndDate())
      .maxParticipants(challenge.getMaxParticipants())
      .currentParticipants(challenge.getCurrentParticipants())
      .depositAmount(challenge.getDepositAmount())
      .status(challenge.getStatus())
      .creator(CreatorInfo.builder()
        .id(challenge.getCreator().getId())
        .nickname(challenge.getCreator().getNickname())
        .build())
      .isParticipating(isParticipating)
      .createdAt(challenge.getCreatedAt())
      .build();
  }
}
