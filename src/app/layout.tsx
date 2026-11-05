import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import AdsenseScript from "@/components/ads/adsense-script";

export const metadata: Metadata = {
  title: "CAR HUZY - 대한민국 신차·중고차 가격 비교 및 예산 맞춤 추천",
  description:
    "내 보유 현금과 월 납입금으로 살 수 있는 자동차를 즉시 계산하고 추천해 드립니다. 현대, 기아, 제네시스, 수입차 신차 가격표 및 감가율 분석 중고차 실거래 시세 비교.",
  metadataBase: new URL("https://car.huzy.net"),
  verification: {
    other: {
      "naver-site-verification": "356ee301e0e87d7b038ae3033a166e9a994dbd51",
    },
  },
  openGraph: {
    title: "CAR HUZY - 대한민국 자동차 가격 비교 & 구매 예산 추천",
    description: "보유 자금과 월 한도액을 입력하면 구매 가능한 신차·중고차를 실시간으로 자동 추천해 드립니다.",
    url: "https://car.huzy.net",
    siteName: "CAR HUZY",
    locale: "ko_KR",
    type: "website",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="356ee301e0e87d7b038ae3033a166e9a994dbd51" />
        <AdsenseScript />
        {/* Google Tag Manager */}
        <Script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-M2JCBBBF"
          strategy="afterInteractive"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-800">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
