import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 예산 맞춤 자동차 추천 계산기 | 월 소득·보유 현금별 구매 가능 차종 - CAR HUZY",
  description:
    "내 월 소득과 가용 현금, 월 유지비 한도에 딱 맞는 신차 및 중고차를 맞춤 추천해 드리는 스마트 자동차 예산 플래너.",
  keywords: [
    "예산별 자동차 추천",
    "월급 자동차 추천",
    "사회초년생 첫차 추천",
    "내 소득에 맞는 차",
    "자동차 유지비 계산",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/calculator/budget",
  },
  openGraph: {
    title: "내 소득 & 예산 맞춤 자동차 추천 | CAR HUZY",
    description: "보유 자금과 월 유지비 한도를 입력하면 최적의 추천 차종 리스트를 안내합니다.",
    url: "https://car.huzy.net/calculator/budget",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
  },
};

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
