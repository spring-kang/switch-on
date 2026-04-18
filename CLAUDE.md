# Switch-On 다이어트 웹 서비스

## 프로젝트 개요
다이어트를 함께 하는 사람들이 모여 챌린지를 수행하고, 커뮤니티를 통해 인증 및 정보를 공유하는 웹 서비스

### MVP 범위
- 스위치온 다이어트 (간헐적 단식 + 식단 인증) 전용

---

## 배포 환경

### Production URLs
- **Frontend (Vercel):** https://switch-on-eight.vercel.app
- **Backend (Railway):** https://switch-on-production.up.railway.app

### 환경변수

#### Backend (Railway)
```
PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD  # PostgreSQL (자동)
JWT_SECRET=<32자 이상 시크릿 키>
CORS_ORIGINS=https://switch-on-eight.vercel.app
PORT=8080  # 자동
```

#### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://switch-on-production.up.railway.app/api
```

---

## 기술 스택
- **백엔드:** Spring Boot 3.2.5 + Java 17
- **프론트엔드:** Next.js 14 (App Router) + Tailwind CSS
- **DB:** PostgreSQL (운영) / H2 (개발)
- **인증:** JWT + 이메일/비밀번호
- **배포:** Vercel (Frontend) + Railway (Backend + PostgreSQL)

---

## 개발 진행 상황

### Phase 1: 프로젝트 초기 설정 ✅
- [x] Spring Boot 프로젝트 생성 (`backend/`)
- [x] Next.js 프로젝트 생성 (`frontend/`)
- [x] 공통 설정 (CORS, Security, DB 연결)
- [x] Git 잔디 스타일 UI 및 산뜻한 색상 팔레트 적용

### Phase 2: 사용자 관리 ✅
- [x] 회원가입/로그인 API
- [x] JWT 토큰 발급/검증
- [x] 로그인/회원가입 페이지

### Phase 3: 챌린지 시스템 ✅
- [x] 챌린지 생성 (스위치온 다이어트)
  - 기간 설정
  - 참가 인원 제한
  - 디파짓 금액 설정
- [x] 챌린지 참여 신청/탈퇴
- [x] 디파짓 결제 (Mock API)
- [x] 챌린지 목록/상세 페이지

### Phase 4: 미션 수행 ✅
- [x] 간헐적 단식 체크 (16:8)
  - 단식 완료 버튼
- [x] 식단 인증
  - 시간대별 인증 (아침/점심/저녁)
- [x] 미션 카드 컴포넌트

### Phase 5: 배포 ✅
- [x] Railway 백엔드 배포 (PostgreSQL)
- [x] Vercel 프론트엔드 배포
- [x] CORS 설정
- [x] 환경변수 설정

### Phase 6: 커뮤니티 (예정)
- [ ] 인증 피드 (타임라인)
- [ ] 댓글/좋아요
- [ ] 정보 공유 게시판

### Phase 7: 정산 시스템 (예정)
- [ ] 미션 달성률 계산
- [ ] 디파짓 환급/몰수 로직 (Mock)
- [ ] Git grass 스타일 히트맵 캘린더

---

## 프로젝트 구조

```
switch-on/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/com/switchon/
│   │   ├── config/            # 설정 (Security, CORS)
│   │   ├── controller/        # REST 컨트롤러
│   │   ├── dto/               # DTO 클래스
│   │   ├── entity/            # JPA 엔티티
│   │   ├── repository/        # JPA 레포지토리
│   │   ├── security/          # JWT 관련
│   │   └── service/           # 비즈니스 로직
│   ├── application.yml        # 개발 설정 (H2)
│   ├── application-prod.yml   # 프로덕션 설정 (PostgreSQL)
│   ├── Procfile              # Railway 배포
│   └── nixpacks.toml         # Railway 빌드 설정
│
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/              # App Router 페이지
│   │   ├── components/       # React 컴포넌트
│   │   └── lib/              # API 클라이언트
│   └── tailwind.config.ts    # Tailwind 설정
│
└── CLAUDE.md                  # 프로젝트 문서
```

---

## 로컬 개발 환경

### Backend 실행
```bash
cd backend
./gradlew bootRun
# http://localhost:8080
```

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

---

## 주요 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 챌린지
- `GET /api/challenges` - 챌린지 목록
- `GET /api/challenges/{id}` - 챌린지 상세
- `POST /api/challenges` - 챌린지 생성
- `POST /api/challenges/{id}/join` - 챌린지 참가
- `DELETE /api/challenges/{id}/leave` - 챌린지 탈퇴
- `GET /api/challenges/{id}/participants` - 참가자 목록

### 미션
- `GET /api/challenges/{id}/missions` - 미션 목록
- `POST /api/challenges/{id}/missions/{missionId}/complete` - 미션 완료

---

## 코딩 컨벤션
- 들여쓰기: 2칸
- 커밋 메시지: 한국어 (예: `feat: 회원가입 API 구현`)
- 주석: 한국어
