import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "중고차 실거래 시세표 & 감가율 분석 조회 | CAR HUZY",
  description:
    "빅데이터 기반 연식별, 주행거리별 중고차 실거래 시세 및 감가율 분석, 침수/사고 이력 확인 팁.",
  keywords: [
    "중고차 시세",
    "중고차 실거래가",
    "자동차 감가율",
    "엔카 시세 비교",
    "중고차 추천",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/used-cars",
  },
  openGraph: {
    title: "중고차 실거래 시세 & 감가율 빅데이터 분석 | CAR HUZY",
    description: "실제 거래 데이터 기반 중고차 적정 시세와 잔존가치 감가율을 확인하세요.",
    url: "https://car.huzy.net/used-cars",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
  },
};

export default function UsedCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
