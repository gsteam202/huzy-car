"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, RefreshCw, X, CheckCircle2, AlertCircle } from "lucide-react";

const AD_BLOCKING_RECOVERY_SCRIPT_ID = "google-adsense-ad-blocking-recovery";
const GOOGLE_FC_PRESENT_SCRIPT_ID = "googlefc-present-signal";
const DISMISS_KEY = "car_huzy_adblock_dismissed_until";

export function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const rawId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-7785149213798356";
  const publisherId = rawId.replace(/^ca-/, "");

  // 1. Google Funding Choices Official Ad-Blocking Recovery Script Injection
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById(AD_BLOCKING_RECOVERY_SCRIPT_ID)) {
      const recoveryScript = document.createElement("script");
      recoveryScript.id = AD_BLOCKING_RECOVERY_SCRIPT_ID;
      recoveryScript.src = `https://fundingchoicesmessages.google.com/i/${publisherId}?ers=1`;
      recoveryScript.async = true;
      document.head.appendChild(recoveryScript);
    }

    if (!document.getElementById(GOOGLE_FC_PRESENT_SCRIPT_ID)) {
      const presentScript = document.createElement("script");
      presentScript.id = GOOGLE_FC_PRESENT_SCRIPT_ID;
      presentScript.textContent = `
        (function() {
          function signalGooglefcPresent() {
            if (!window.frames['googlefcPresent']) {
              if (document.body) {
                var iframe = document.createElement('iframe');
                iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                iframe.style.display = 'none';
                iframe.name = 'googlefcPresent';
                document.body.appendChild(iframe);
              } else {
                setTimeout(signalGooglefcPresent, 0);
              }
            }
          }
          signalGooglefcPresent();
        })();
      `;
      document.head.appendChild(presentScript);
    }
  }, [publisherId]);

  // 2. Client-side Multi-Vector AdBlock Detection & Modal Trigger
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user dismissed today (within 24 hours)
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }
    } catch {}

    const handleAdblockFound = () => {
      setAdBlockDetected(true);
      setIsOpen(true);
    };

    // Listen to explicit adsense error event from AdsenseScript
    const onAdsenseError = () => {
      handleAdblockFound();
    };
    window.addEventListener("adsense-error", onAdsenseError);

    // Run DOM bait check after DOM stabilizes
    const probeTimer = setTimeout(async () => {
      // Vector A: Check if window.__adsenseFailed was already marked
      if (window.__adsenseFailed) {
        handleAdblockFound();
        return;
      }

      // Vector B: Bait DOM element test
      const bait = document.createElement("div");
      bait.className =
        "adsbygoogle pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-banner ad-unit google-ad";
      bait.setAttribute(
        "style",
        "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;",
      );
      document.body.appendChild(bait);

      const baitStyle = window.getComputedStyle(bait);
      const isBlockedDom =
        baitStyle.display === "none" ||
        baitStyle.visibility === "hidden" ||
        bait.offsetParent === null ||
        bait.clientHeight === 0;

      bait.remove();

      if (isBlockedDom) {
        handleAdblockFound();
        return;
      }

      // Vector C: Probe network request against known ad script path
      try {
        const testReq = await fetch(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
          }
        ).catch(() => null);

        if (!testReq && !window.__adsenseReady) {
          handleAdblockFound();
        }
      } catch {
        handleAdblockFound();
      }
    }, 2200);

    return () => {
      clearTimeout(probeTimer);
      window.removeEventListener("adsense-error", onAdsenseError);
    };
  }, []);

  const handleDismissToday = () => {
    try {
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + 24 * 60 * 60 * 1000),
      );
    } catch {}
    setIsOpen(false);
  };

  const handleDismissSession = () => {
    setIsOpen(false);
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (!isOpen || !adBlockDetected) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismissSession}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-1">
              <AlertCircle className="w-3 h-3" />
              광고 차단 프로그램(AdBlock) 감지
            </span>
            <h2
              id="adblock-dialog-title"
              className="text-lg font-black text-slate-900 leading-snug tracking-tight"
            >
              CAR HUZY 무료 운영 지원 안내
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed mb-6">
          <p>
            CAR HUZY는 대한민국 전 차종 신차 가격표, 중고차 실거래 시세, 맞춤형 예산 계산기 등
            모든 자동차 금융·비교 서비스를 방문자분들께{" "}
            <strong className="text-slate-900 font-semibold">100% 무료</strong>로 제공하고 있습니다.
          </p>
          <p>
            안정적인 서버 운영과 최신 차량 제원·시세 데이터 업데이트를 위해 소정의 광고 수익으로
            운영되고 있습니다. 원활한 서비스 이용을 위해{" "}
            <strong className="text-blue-600 font-bold">광고 차단을 해제(허용)</strong>해 주시면
            서비스 유지에 큰 힘이 됩니다. 🙏
          </p>

          {/* Simple How-to Guide */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              광고 차단 해제 방법
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              브라우저 우측 상단 확장 프로그램 아이콘(AdBlock, uBlock 등) 클릭 ➔
              <span className="font-medium text-slate-700"> [이 사이트에서 광고 허용]</span> 또는
              <span className="font-medium text-slate-700"> [차단 일시중지]</span>를 선택해 주세요.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            차단 해제 후 새로고침
          </button>
          <button
            type="button"
            onClick={handleDismissToday}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
          >
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
