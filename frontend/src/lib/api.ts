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
