package com.switchon.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "missions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "challenge_id", nullable = false)
  private Challenge challenge;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MissionType type;

  // 간헐적 단식용 설정
  private Integer fastingHours; // 단식 시간 (예: 16)
  private String eatingWindowStart; // 식사 시작 시간 (예: "12:00")
  private String eatingWindowEnd; // 식사 종료 시간 (예: "20:00")

  // 식단 인증용 설정
  private Integer requiredMeals; // 필요한 식사 인증 수 (예: 3)

  @Builder.Default
  private Boolean isActive = true;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<MissionCompletion> completions = new ArrayList<>();

  public enum MissionType {
    FASTING,      // 간헐적 단식
    MEAL_LOG      // 식단 인증
  }
}
