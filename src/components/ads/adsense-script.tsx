"use client";

import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adsenseReady?: boolean;
    __adsenseFailed?: boolean;
  }
}

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-7785149213798356";
export const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

export default function AdsenseScript() {
  return (
    <Script
      id="google-adsense"
      src={ADSENSE_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onReady={() => {
        window.__adsenseReady = true;
        window.__adsenseFailed = false;
        window.dispatchEvent(new Event("adsense-ready"));
      }}
      onError={() => {
        window.__adsenseFailed = true;
        window.dispatchEvent(new Event("adsense-error"));
      }}
    />
  );
}
