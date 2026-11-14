import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동차 할부 계산기 | 신차·중고차 대출 금리별 월 납입금 & 원리금균등 상환 견적 - CAR HUZY",
  description:
    "차량 가격, 선수금, 할부 기간(12~120개월), 금리별 월 납입금 및 총 대출 이자 비용을 실시간 계산하고 원리금 상환 계획표를 제공하는 금융 계산기.",
  keywords: [
    "자동차 할부 계산기",
    "신차 할부 금리",
    "중고차 전액할부",
    "현대차 할부 계산",
    "오토론 금리 비교",
    "월 납입금 계산기",
    "자동차 금융 견적",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/calculator/installment",
  },
  openGraph: {
    title: "자동차 할부 계산기 (신차·중고차 금리별 월 상환액) | CAR HUZY",
    description:
      "선수금과 할부 기간, 대출 금리를 입력하면 매월 갚아야 할 원금과 이자, 총 이자 비용을 즉시 계산합니다.",
    url: "https://car.huzy.net/calculator/installment",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://car.huzy.net/icon-512.png",
        width: 512,
        height: 512,
        alt: "CAR HUZY 자동차 할부 계산기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "자동차 할부 계산기 | 월 납입금 및 총이자 실시간 계산",
    description: "신차 및 중고차 오토론 할부 금리와 상환 계획표를 원클릭으로 확인하세요.",
  },
};

export default function InstallmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CAR HUZY 자동차 할부 대출 계산기",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description:
      "원리금 균등상환 방식 자동차 할부 대출 금리, 월 납입금, 총 이자 계산 및 상환 일정표 시뮬레이터",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "자동차 할부 원리금 균등상환 계산 방식은 어떻게 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "원리금 균등상환은 대출 원금과 총 이자를 할부 개월 수로 나누어 매월 동일한 금액을 납부하는 방식입니다. 대출 초기에는 이자 비중이 높고 후기로 갈수록 원금 상환 비중이 커집니다.",
        },
      },
      {
        "@type": "Question",
        name: "선수금을 많이 넣으면 월 납입금이 얼마나 줄어드나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "선수금을 넣는 만큼 대출 원금이 줄어들어 매월 납부해야 할 이자와 원금이 동시에 감소합니다. 통상 차량 가격의 20~30%를 선수금으로 납입하는 것이 이자 부담을 줄이는 가장 경제적인 방법입니다.",
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
