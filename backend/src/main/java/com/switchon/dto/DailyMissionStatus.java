package com.switchon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class DailyMissionStatus {

  private LocalDate date;
  private int totalMissions;
  private int completedMissions;
  private boolean allCompleted;
  private List<MissionResponse> missions;

  public static DailyMissionStatus of(LocalDate date, List<MissionResponse> missions) {
    int total = missions.size();
    int completed = (int) missions.stream()
      .filter(m -> Boolean.TRUE.equals(m.getCompletedToday()))
      .count();

    return DailyMissionStatus.builder()
      .date(date)
      .totalMissions(total)
      .completedMissions(completed)
      .allCompleted(total > 0 && total == completed)
      .missions(missions)
      .build();
  }
}
