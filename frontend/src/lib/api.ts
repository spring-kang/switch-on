const API_BASE_URL = "http://localhost:8080/api";

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserInfo;
}

export interface ApiError {
  error: string;
}

// API 요청 헬퍼
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "요청에 실패했습니다");
  }

  return response.json();
}

// 회원가입
export async function signUp(
  email: string,
  password: string,
  nickname: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, nickname }),
  });
}

// 로그인
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 현재 사용자 정보 조회
export async function getCurrentUser(): Promise<UserInfo> {
  return request<UserInfo>("/auth/me");
}

// 로그아웃
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// 토큰 저장
export function saveAuth(response: AuthResponse) {
  localStorage.setItem("accessToken", response.accessToken);
  localStorage.setItem("user", JSON.stringify(response.user));
}

// 저장된 사용자 정보 가져오기
export function getStoredUser(): UserInfo | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// 로그인 여부 확인
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("accessToken");
}

// Challenge 관련 타입
export interface CreatorInfo {
  id: number;
  nickname: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  depositAmount: number;
  status: "RECRUITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  creator: CreatorInfo;
  isParticipating: boolean;
  createdAt: string;
}

export interface Participant {
  id: number;
  userId: number;
  nickname: string;
  depositAmount: number;
  depositStatus: "PENDING" | "PAID" | "REFUNDED" | "FORFEITED";
  status: "ACTIVE" | "WITHDRAWN" | "COMPLETED" | "FAILED";
  achievementRate: number;
  joinedAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  depositAmount: number;
}

// 챌린지 목록 조회
export async function getChallenges(): Promise<Challenge[]> {
  return request<Challenge[]>("/challenges");
}

// 챌린지 상세 조회
export async function getChallenge(id: number): Promise<Challenge> {
  return request<Challenge>(`/challenges/${id}`);
}

// 챌린지 생성
export async function createChallenge(
  data: CreateChallengeRequest
): Promise<Challenge> {
  return request<Challenge>("/challenges", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 챌린지 참가
export async function joinChallenge(id: number): Promise<Participant> {
  return request<Participant>(`/challenges/${id}/join`, {
    method: "POST",
    body: JSON.stringify({ paymentMethod: "MOCK" }),
  });
}

// 챌린지 탈퇴
export async function leaveChallenge(id: number): Promise<void> {
  return request<void>(`/challenges/${id}/leave`, {
    method: "DELETE",
  });
}

// 챌린지 참가자 목록
export async function getParticipants(id: number): Promise<Participant[]> {
  return request<Participant[]>(`/challenges/${id}/participants`);
}

// 내가 참가한 챌린지 목록
export async function getMyChallenges(): Promise<Challenge[]> {
  return request<Challenge[]>("/challenges/my");
}
