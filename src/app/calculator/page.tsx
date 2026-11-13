import type { Metadata } from "next";
import { IntegratedCarCalculator } from "@/components/calculator/integrated-car-calculator";

export const metadata: Metadata = {
  title: "2026 자동차 통합 계산기 | 취등록세·자동차세·할부 원스톱 시뮬레이터 - CAR HUZY",
  description:
    "신차 및 중고차 구입 시 발생하는 취등록세(7%, 경차/친환경차 감면), 연간 자동차세(배기량별 cc당 세액 및 1월 연납 할인), 월 할부 상환액(원리금 균등)과 총소유비용(TCO)을 한 번에 계산하는 올인원 자동차 금융 계산기입니다.",
  keywords: [
    "자동차 계산기",
    "취등록세 계산기",
    "자동차세 계산기",
    "자동차 할부 계산기",
    "신차 견적 계산기",
    "자동차 세금 연납 할인",
    "친환경차 세금 감면",
    "CAR HUZY",
  ],
  alternates: {
    canonical: "https://car.huzy.net/calculator",
  },
  openGraph: {
    title: "자동차 통합 금융 계산기 (취등록세·자동차세·할부) | CAR HUZY",
    description:
      "차량 가격만 넣으면 취등록세, 공채할인, 연간 자동차세, 월 할부금까지 출고와 유지에 드는 모든 비용을 한눈에 시뮬레이션합니다.",
    url: "https://car.huzy.net/calculator",
    type: "website",
  },
};

export default function CalculatorHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CAR HUZY 자동차 통합 세금 및 할부 계산기",
    operatingSystem: "All",
    applicationCategory: "FinanceApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description:
      "2026년 최신 세법 기준 승용차/경차/전기차 취등록세, 연간 자동차세, 월 할부 원리금 통합 시뮬레이터",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "승용차 취등록세 세율과 감면 혜택은 어떻게 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "일반 승용차의 취등록세는 차량 공급가액의 7%입니다. 경차는 최대 75만원까지 감면(세율 4%), 하이브리드 차량은 40만원, 전기차 및 수소차는 최대 140만원의 취득세 감면 혜택이 적용됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "자동차세 연납 제도는 무엇이며 할인은 얼마나 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "자동차세는 매년 6월과 12월 2회에 걸쳐 부과되지만, 1월에 1년 치 세금을 미리 일시납부하면 2~12월분 세액의 약 5% 수준(연간 약 4.57%)을 공제받을 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "신차 출고 시 차량 가격 외에 추가로 준비해야 할 현금은 얼마인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "취등록세(차량가의 약 7%), 지자체 공채 매입/할인 비용(차량가의 1~3%), 증지/인지대 및 번호판 대행 수수료(약 7~10만원), 그리고 의무 가입인 자동차 책임보험료가 추가로 소요됩니다.",
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
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <IntegratedCarCalculator />
        </div>
      </div>
    </>
  );
}
