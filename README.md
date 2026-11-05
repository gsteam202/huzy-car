# CAR HUZY (car.huzy.net)

> 대한민국 사용자를 위한 신차·중고차 가격 비교 및 구매 예산 추천 플랫폼

## 1. 개요
- **서비스 도메인**: [https://car.huzy.net](https://car.huzy.net)
- **핵심 차별점**: 사용자의 현재 보유 자금과 월 납입 가능 금액을 바탕으로 취득세(7%), 공채/부대비용, 원리금균등분할상환 역산 공식을 적용하여 구매 가능한 최적의 차량(신차 및 중고차)을 실시간으로 추천합니다.

## 2. 주요 기능
1. **내 예산으로 차 찾기 (핵심 기능)**
   - 보유 자금, 비상 예비 자금, 기존 차량 판매대금, 월 납입 한도, 할부 기간(12~72개월), 연 금리 입력
   - 취득세 감면(경차 75만원 공제, 전기차 140만원 공제 등) 및 부대비용 자동 반영
   - 월 납입금 역산 기반 구매 가능 상한가 산출 및 추천 엔진
   - 추천 태그 부여: 최저가, 가성비, 패밀리카, 친환경, 신차/중고차 최선책 등
2. **신차 가격 비교**
   - 브랜드 → 모델 → 세대 → 연식 → 트림 → 옵션 구조
   - 트림별 기본 가격 및 세부 제원(연비, 배기량, 승차정원, 차체 규격)
   - 옵션 선택에 따른 견적 및 취등록세, 탁송료, 총 구입비용 자동 산출
3. **중고차 시세 및 감가율 분석**
   - 신차 모델과 연계된 1~10년 연식별 중고차 시세 트렌드 그래프 (`Recharts`)
   - 신차 출고가 대비 감가율 산출
   - 주행거리, 사고 유무, 연식 필터링
4. **정밀 자동차 할부 계산기**
   - 원리금균등상환, 무이자 할부, 잔가보장형(유예할부) 금융 시뮬레이션
   - 12~72개월 기간별 및 3.5%~8.5% 금리별 비교 매트릭스
   - 전 기간 월별 원금/이자/잔액 상환 스케줄표
   - 중도 조기 상환 시뮬레이션
5. **차량 1:1 비교 (최대 3대)**
   - 가격, 제원, 연비, 월 예상 납입금, 월 예상 유지비, 감가율을 한눈에 비교하는 매트릭스
6. **커뮤니티 및 회원 관리**
   - 자유게시판, 구매후기, 견적공유, 질문답변
   - NextAuth 기반 자격증명 및 Google OAuth 2.0 연동
   - Argon2id 비밀번호 암호화 해싱
7. **관리자 대시보드**
   - 국토교통부(MOLIT) 및 Encar 프로바이더 데이터 동기화
   - 신차 및 중고차 대량 CSV 업로드 지원

## 3. 기술 스택
- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript strict mode)
- **Styling**: Tailwind CSS 4, Lucide Icons, Recharts
- **Database**: MariaDB 11, Prisma ORM 7
- **Authentication**: NextAuth.js, Google OAuth 2.0, Argon2id
- **Validation**: Zod
- **Infrastructure**: Nginx (Reverse Proxy, HTTP/2, HTTP/3 QUIC, Let's Encrypt SSL), Systemd Service

## 4. 로컬 및 프로덕션 실행
```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션 및 시드
npm run db:push
npm run db:seed

# 테스트 실행
npm test

# 프로덕션 빌드 및 실행
npm run build
npm start
```
