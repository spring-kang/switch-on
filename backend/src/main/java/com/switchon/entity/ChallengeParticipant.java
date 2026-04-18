package com.switchon.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_participants",
  uniqueConstraints = @UniqueConstraint(columnNames = {"challenge_id", "user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeParticipant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "challenge_id", nullable = false)
  private Challenge challenge;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal depositAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private DepositStatus depositStatus = DepositStatus.PENDING;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ParticipantStatus status = ParticipantStatus.ACTIVE;

  // 미션 달성률 (0-100)
  @Column(nullable = false)
  @Builder.Default
  private Integer achievementRate = 0;

  // 환급 금액
  @Column(precision = 10, scale = 2)
  private BigDecimal refundAmount;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime joinedAt;

  public enum DepositStatus {
    PENDING,   // 결제 대기
    PAID,      // 결제 완료
    REFUNDED,  // 환급 완료
    FORFEITED  // 몰수
  }

  public enum ParticipantStatus {
    ACTIVE,    // 참가중
    COMPLETED, // 완료
    WITHDRAWN  // 탈퇴
  }
}
