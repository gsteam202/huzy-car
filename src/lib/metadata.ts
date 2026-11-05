import type { Metadata } from "next";

export const SITE_URL = "https://car.huzy.net";

export const SITE_KEYWORDS = [
  "신차 가격표",
  "중고차 시세",
  "자동차 할부 계산기",
  "예산별 자동차 추천",
  "현대차 가격표",
  "기아차 견적",
  "제네시스 견적",
  "수입차 프로모션",
  "자동차 감가율",
  "카휴지",
  "CAR HUZY",
];

export const siteMetadata: Metadata = {
  title: "CAR HUZY - 대한민국 신차·중고차 가격 비교 및 예산 맞춤 추천",
  description:
    "내 보유 현금과 월 납입금으로 살 수 있는 자동차를 즉시 계산하고 추천해 드립니다. 현대, 기아, 제네시스, 수입차 신차 가격표 및 감가율 분석 중고차 실거래 시세 비교.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  keywords: SITE_KEYWORDS,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    other: {
      "naver-site-verification": "356ee301e0e87d7b038ae3033a166e9a994dbd51",
    },
  },
  openGraph: {
    title: "CAR HUZY - 대한민국 자동차 가격 비교 & 구매 예산 추천",
    description: "보유 자금과 월 한도액을 입력하면 구매 가능한 신차·중고차를 실시간으로 자동 추천해 드립니다.",
    url: SITE_URL,
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
        alt: "CAR HUZY 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAR HUZY - 대한민국 신차·중고차 가격 비교 및 예산 맞춤 추천",
    description: "내 보유 현금과 월 납입금으로 살 수 있는 자동차를 즉시 계산하고 추천해 드립니다.",
    images: [`${SITE_URL}/icon-512.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
