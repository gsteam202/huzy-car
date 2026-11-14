import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 자동차세 계산기 & 취등록세 연납 할인 모의계산 | CAR HUZY",
  description:
    "2026년 최신 세법 기준 배기량별(cc) 연간 자동차세, 1월 연납 할인 공제율(위택스), 신차·중고차 취등록세(7%, 경차/전기차/하이브리드 감면 혜택) 및 공채비용 실시간 원스톱 모의계산기.",
  keywords: [
    "자동차세 계산기",
    "2026 자동차세 연납 할인",
    "취등록세 계산기",
    "배기량별 자동차세",
    "자동차세 1월 연납",
    "위택스 자동차세 납부",
    "전기차 자동차세",
    "하이브리드 취득세 감면",
    "자동차 세금 계산",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/calculator/tax",
  },
  openGraph: {
    title: "2026 자동차세 계산기 & 취등록세 연납 할인 모의계산 | CAR HUZY",
    description:
      "차량 가격과 배기량만 입력하면 2026년 최신 세법 기준 취등록세, 1월 연납 할인 세액, 연간 자동차세를 실시간으로 즉시 계산합니다.",
    url: "https://car.huzy.net/calculator/tax",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://car.huzy.net/icon-512.png",
        width: 512,
        height: 512,
        alt: "CAR HUZY 자동차세 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 자동차세 계산기 & 취등록세 연납 할인 모의계산 | CAR HUZY",
    description: "2026년 최신 세법 기준 배기량별 자동차세와 연납 할인액을 실시간으로 확인하세요.",
  },
};

export default function CarTaxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CAR HUZY 2026 자동차세 & 취등록세 계산기",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description:
      "2026년 대한민국 최신 세법 반영 승용차, 화물차, 전기차, 하이브리드 취등록세 및 배기량별 연간 자동차세 연납 할인 계산기",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "2026년 자동차세 연납 할인율과 신청 기간은 언제인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2026년 자동차세 연납은 1월 16일부터 1월 31일까지 위택스(Wetax) 또는 이택스(서울시)를 통해 신청 및 납부할 수 있습니다. 1월 연납 시 2~12월분 세액의 약 5% 수준(연세액 기준 약 4.57%)이 공제됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "배기량별 연간 자동차세 세율 계산 공식은 어떻게 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "비영업용 승용차 기준: 1,000cc 이하는 cc당 80원, 1,600cc 이하는 cc당 140원, 1,600cc 초과는 cc당 200원이 부과되며, 여기에 지방교육세 30%가 가산됩니다. 차령 3년 차부터 매년 5%씩 최대 50%까지 차령 경감이 적용됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "전기차와 수소차의 연간 자동차세는 얼마인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "전기차 및 수소차는 비영업용 기준 배기량과 무관하게 연간 기본 세액 100,000원에 지방교육세 30,000원이 합산되어 총 130,000원이 고정 부과됩니다.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
