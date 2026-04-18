package com.switchon.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mission_completions",
  uniqueConstraints = @UniqueConstraint(columnNames = {"mission_id", "user_id", "completion_date", "meal_type"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissionCompletion {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "mission_id", nullable = false)
  private Mission mission;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "completion_date", nullable = false)
  private LocalDate completionDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private CompletionStatus status = CompletionStatus.COMPLETED;

  // 식단 인증용 이미지 URL
  private String imageUrl;

  // 식단 인증용 메모
  @Column(columnDefinition = "TEXT")
  private String note;

  // 식사 타입 (아침/점심/저녁)
  @Enumerated(EnumType.STRING)
  private MealType mealType;

  @CreationTimestamp
  private LocalDateTime completedAt;

  public enum CompletionStatus {
    COMPLETED,    // 완료
    PARTIAL,      // 부분 완료
    SKIPPED       // 건너뜀
  }

  public enum MealType {
    BREAKFAST,    // 아침
    LUNCH,        // 점심
    DINNER        // 저녁
  }
}
