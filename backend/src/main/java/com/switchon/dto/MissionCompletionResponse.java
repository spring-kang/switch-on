package com.switchon.dto;

import com.switchon.entity.MissionCompletion;
import com.switchon.entity.MissionCompletion.CompletionStatus;
import com.switchon.entity.MissionCompletion.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class MissionCompletionResponse {

  private Long id;
  private Long missionId;
  private String missionTitle;
  private Long userId;
  private String nickname;
  private LocalDate completionDate;
  private CompletionStatus status;
  private String imageUrl;
  private String note;
  private MealType mealType;
  private LocalDateTime completedAt;

  public static MissionCompletionResponse from(MissionCompletion completion) {
    return MissionCompletionResponse.builder()
      .id(completion.getId())
      .missionId(completion.getMission().getId())
      .missionTitle(completion.getMission().getTitle())
      .userId(completion.getUser().getId())
      .nickname(completion.getUser().getNickname())
      .completionDate(completion.getCompletionDate())
      .status(completion.getStatus())
      .imageUrl(completion.getImageUrl())
      .note(completion.getNote())
      .mealType(completion.getMealType())
      .completedAt(completion.getCompletedAt())
      .build();
  }
}
