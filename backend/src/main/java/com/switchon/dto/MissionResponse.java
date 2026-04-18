package com.switchon.dto;

import com.switchon.entity.Mission;
import com.switchon.entity.Mission.MissionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class MissionResponse {

  private Long id;
  private Long challengeId;
  private String title;
  private String description;
  private MissionType type;
  private Integer fastingHours;
  private String eatingWindowStart;
  private String eatingWindowEnd;
  private Integer requiredMeals;
  private Boolean isActive;

  // 오늘 완료 여부
  private Boolean completedToday;
  private Integer completedMealsToday; // 식단 인증의 경우

  public static MissionResponse from(Mission mission, boolean completedToday, int completedMealsToday) {
    return MissionResponse.builder()
      .id(mission.getId())
      .challengeId(mission.getChallenge().getId())
      .title(mission.getTitle())
      .description(mission.getDescription())
      .type(mission.getType())
      .fastingHours(mission.getFastingHours())
      .eatingWindowStart(mission.getEatingWindowStart())
      .eatingWindowEnd(mission.getEatingWindowEnd())
      .requiredMeals(mission.getRequiredMeals())
      .isActive(mission.getIsActive())
      .completedToday(completedToday)
      .completedMealsToday(completedMealsToday)
      .build();
  }
}
