package com.switchon.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ChallengeType type = ChallengeType.SWITCH_ON;

  @Column(nullable = false)
  private LocalDate startDate;

  @Column(nullable = false)
  private LocalDate endDate;

  @Column(nullable = false)
  private Integer maxParticipants;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal depositAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ChallengeStatus status = ChallengeStatus.RECRUITING;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "creator_id", nullable = false)
  private User creator;

  @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<ChallengeParticipant> participants = new ArrayList<>();

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public enum ChallengeType {
    SWITCH_ON  // 스위치온 다이어트 (간헐적 단식 + 식단 인증)
  }

  public enum ChallengeStatus {
    RECRUITING,  // 모집중
    IN_PROGRESS, // 진행중
    COMPLETED,   // 완료
    CANCELLED    // 취소
  }

  // 현재 참가자 수
  public int getCurrentParticipants() {
    return participants.size();
  }

  // 참가 가능 여부
  public boolean canJoin() {
    return status == ChallengeStatus.RECRUITING
      && participants.size() < maxParticipants
      && !LocalDate.now().isAfter(startDate);
  }
}
