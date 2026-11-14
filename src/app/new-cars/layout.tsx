import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 신차 가격표 & 트림별 옵션 제원 실구매가 비교 | CAR HUZY",
  description:
    "현대, 기아, 제네시스, 벤츠, BMW 등 국내외 전 브랜드 최신 신차 가격표, 트림별 옵션, 출고 대기기간, 할인 프로모션 실구매가 비교.",
  keywords: [
    "신차 가격표",
    "2026 신차 견적",
    "현대차 가격표",
    "기아차 견적",
    "제네시스 가격표",
    "수입차 프로모션",
    "신차 출고 대기기간",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/new-cars",
  },
  openGraph: {
    title: "2026 대한민국 신차 가격표 & 트림별 제원 비교 | CAR HUZY",
    description: "국내외 모든 신차의 최신 가격표, 옵션, 출고 예상 기간을 한눈에 비교하세요.",
    url: "https://car.huzy.net/new-cars",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
  },
};

export default function NewCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
