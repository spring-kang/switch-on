package com.switchon.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinChallengeRequest {

  // Mock 결제를 위한 필드 (실제 결제 시 카드 정보 등이 들어감)
  private String paymentMethod; // "MOCK" 또는 실제 결제 수단
}
