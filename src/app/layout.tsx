import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import AdsenseScript from "@/components/ads/adsense-script";
import { AdBlockDetector } from "@/components/ads/adblock-detector";
import { siteMetadata } from "@/lib/metadata";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://car.huzy.net/#organization",
        name: "CAR HUZY",
        alternateName: ["카휴지", "Huzy Car"],
        url: "https://car.huzy.net",
        logo: {
          "@type": "ImageObject",
          url: "https://car.huzy.net/icon-512.png",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://car.huzy.net/#website",
        url: "https://car.huzy.net",
        name: "CAR HUZY",
        description:
          "내 보유 현금과 월 납입금으로 살 수 있는 자동차를 즉시 계산하고 추천해 드립니다.",
        publisher: {
          "@id": "https://car.huzy.net/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://car.huzy.net/new-cars?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "ko-KR",
      },
    ],
  };

  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="356ee301e0e87d7b038ae3033a166e9a994dbd51" />
        <meta name="google-site-verification" content="XPkg0dTNT-GqQHpv36nb23ZSu2ZsN8NNQ-RhqTf531Q" />
        <meta name="msvalidate.01" content="BE791BD749DEB6457FC7C93C8090B556" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
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
          <AdBlockDetector />
        </Providers>
      </body>
    </html>
  );
}
