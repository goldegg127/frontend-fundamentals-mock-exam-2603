# 회의실 예약 시스템

토스 Frontend Fundamentals 모의고사 - 날짜별 회의실 예약 현황 조회 및 예약 생성 시스템

## Quick Start

```bash
# 의존성 설치
yarn

# 개발 서버 실행 (http://localhost:5173)
yarn start

# 테스트 실행
yarn test

# 빌드
yarn build
```

## 주요 기능

- 날짜별 회의실 예약 현황 조회 (타임라인)
- 내 예약 목록 조회 및 취소
- 조건별 예약 가능 회의실 필터링
- 새로운 예약 생성

## 기술 스택

- **React 17** + TypeScript
- **React Query** - 서버 상태 관리
- **React Router 6** - 라우팅 및 URL 상태 관리
- **Emotion** - CSS-in-JS 스타일링
- **Vite** - 빌드 도구
- **Vitest** - 테스트 프레임워크
- **MSW** - API 모킹

## 프로젝트 구조

```
src/
├── shared/              # 2개 이상 페이지에서 공유
│   ├── types/          # 공통 타입 (Room, Reservation)
│   ├── hooks/          # 공통 훅 (useRooms)
│   └── components/     # 재사용 컴포넌트
│
└── pages/              # 페이지별 공동위치 (Colocation)
    ├── ReservationStatusPage/   # 예약 현황
    │   ├── components/         # 페이지 전용 컴포넌트
    │   ├── hooks/             # 페이지 전용 훅
    │   ├── domain/            # 비즈니스 로직
    │   └── utils/             # 헬퍼 함수
    │
    └── RoomBookingPage/        # 예약 생성
        ├── components/
        ├── hooks/
        ├── domain/
        └── utils/
```

## 설계 원칙

1. **페이지 기반 공동위치** - 함께 변경될 코드는 함께 위치
2. **순수 함수 중심** - 클래스보다 단순한 함수
3. **선언적 에러 처리** - ErrorBoundary + Suspense
4. **Headless 추상화** - UI와 로직 분리
5. **도메인 분리** - 재사용 가능한 일반 컴포넌트

## 스크립트

```bash
yarn dev          # 개발 서버 실행
yarn build        # 프로덕션 빌드
yarn preview      # 빌드 결과 미리보기
yarn test         # 테스트 실행
yarn test:watch   # 테스트 watch 모드
```
