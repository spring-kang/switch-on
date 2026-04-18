package com.switchon.dto;

import com.switchon.entity.MissionCompletion.MealType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteMissionRequest {

  // 식단 인증용
  private String imageUrl;
  private String note;
  private MealType mealType; // BREAKFAST, LUNCH, DINNER
}
