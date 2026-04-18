package com.switchon.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateChallengeRequest {

  @NotBlank(message = "챌린지 제목은 필수입니다")
  @Size(max = 100, message = "제목은 100자 이내여야 합니다")
  private String title;

  @Size(max = 1000, message = "설명은 1000자 이내여야 합니다")
  private String description;

  @NotNull(message = "시작일은 필수입니다")
  @FutureOrPresent(message = "시작일은 오늘 이후여야 합니다")
  private LocalDate startDate;

  @NotNull(message = "종료일은 필수입니다")
  @FutureOrPresent(message = "종료일은 오늘 이후여야 합니다")
  private LocalDate endDate;

  @NotNull(message = "최대 참가 인원은 필수입니다")
  @Min(value = 2, message = "최소 2명 이상이어야 합니다")
  @Max(value = 100, message = "최대 100명까지 가능합니다")
  private Integer maxParticipants;

  @NotNull(message = "디파짓 금액은 필수입니다")
  @DecimalMin(value = "1000", message = "최소 1,000원 이상이어야 합니다")
  @DecimalMax(value = "1000000", message = "최대 1,000,000원까지 가능합니다")
  private BigDecimal depositAmount;
}
