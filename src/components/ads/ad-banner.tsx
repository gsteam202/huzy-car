"use client";

import { memo, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  createAdMeasurement,
  observeAdSlot,
  reportAdRequest,
} from "@/lib/adsense/care-ad-measurement";
import { observeOptimizedAdSpace } from "@/lib/adsense/care-ad-space";

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-7785149213798356";

export const SLOTS: Record<string, string> = {
  "page-top-slot": process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT || "8104988247",
  "content-mid-slot": process.env.NEXT_PUBLIC_ADSENSE_MIDDLE_SLOT || "1689592358",
  "content-bottom-slot": process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || "4672697540",
};

export type AdFormat = "auto" | "horizontal" | "rectangle";

const subscribeNoop = () => () => {};

export type AdSlotProps = {
  slot?: string;
  placement?: string;
  format?: AdFormat;
  mobileFormat?: AdFormat;
  mobileHeight?: number;
  className?: string;
  compact?: boolean;
  priority?: boolean;
  mobileOnly?: boolean;
};

type Configuration = {
  format: AdFormat;
  responsive: boolean;
  width: number | string;
  height?: number;
};

// Stable Google-owned unit: once pushed, the <ins> element is never unmounted or re-requested on resize.
const GoogleUnit = memo(function GoogleUnit({
  configuration,
  slot,
  placement,
  onStatus,
  onOptimizedEmpty,
}: {
  configuration: Configuration;
  slot: string;
  placement: string;
  onStatus: (value: string) => void;
  onOptimizedEmpty: (value: boolean) => void;
}) {
  const ins = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const measurement = useRef(createAdMeasurement());
  const statusCallback = useRef(onStatus);

  useEffect(() => {
    statusCallback.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    const node = ins.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const maxAttempts = 15;
    let cancelled = false;
    const minimum = typeof configuration.width === "number" ? configuration.width : 120;

    const push = () => {
      if (
        cancelled ||
        pushed.current ||
        !node.isConnected ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      const currentWidth = node.getBoundingClientRect().width;
      if (currentWidth < minimum) {
        if (++attempts < maxAttempts) {
          timer = setTimeout(push, 150);
        }
        return;
      }
      if (node.hasAttribute("data-adsbygoogle-status")) {
        pushed.current = true;
        return;
      }
      try {
        const ads = window as unknown as { adsbygoogle?: object[] };
        ads.adsbygoogle = ads.adsbygoogle || [];
        ads.adsbygoogle.push({});
        pushed.current = true;
        reportAdRequest({ slot, placement, format: configuration.format }, measurement.current);
      } catch (error) {
        if (
          /availableWidth\s*=\s*0|No slot size|All 'ins' elements in the DOM/i.test(
            error instanceof Error ? error.message : String(error)
          ) &&
          ++attempts < maxAttempts
        ) {
          timer = setTimeout(push, 200);
        } else {
          statusCallback.current("failed");
        }
      }
    };

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (!pushed.current) push();
      });
      resizeObserver.observe(node);
    }

    timer = setTimeout(push, 50);
    const wake = () => {
      if (document.visibilityState === "visible" && !pushed.current) push();
    };
    document.addEventListener("visibilitychange", wake);

    const stopStatus = observeAdSlot(
      node,
      { slot, placement, format: configuration.format },
      measurement.current,
      (value) => statusCallback.current(value)
    );

    const stopSpace = observeOptimizedAdSpace(node, onOptimizedEmpty);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", wake);
      stopStatus();
      stopSpace();
    };
  }, [configuration, slot, placement, onOptimizedEmpty]);

  const isHorizontalBanner = configuration.format === "horizontal";

  return (
    <ins
      ref={ins}
      className={`adsbygoogle ${isHorizontalBanner ? "ad-banner-horizontal" : ""}`}
      style={{
        display: "block",
        width: configuration.width,
        maxWidth: "100%",
        height: typeof configuration.width === "number" ? configuration.height : undefined,
        margin: "0 auto",
      }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={isHorizontalBanner ? undefined : configuration.format}
      data-full-width-responsive={isHorizontalBanner ? "false" : configuration.responsive ? "true" : "false"}
    />
  );
});

function AdSlotContent({
  slot = "content-mid-slot",
  placement,
  format = "horizontal",
  mobileFormat = "horizontal",
  mobileHeight = 60,
  className = "",
  compact = false,
  priority = false,
  mobileOnly = false,
}: AdSlotProps) {
  const ref = useRef<HTMLElement>(null);
  const slotId = SLOTS[slot] || (/^\d{10}$/.test(slot) ? slot : "1689592358");
  const actualPlacement = placement || slot;

  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const isInitialInView = Boolean(
    priority ||
      actualPlacement.endsWith("-top") ||
      actualPlacement === "page-top-slot" ||
      compact
  );

  const [inView, setInView] = useState(isInitialInView);
  const [status, setStatus] = useState("pending");
  const [optimizedEmpty, setOptimizedEmpty] = useState(false);
  const frozen = useRef(false);

  // Check if local dev environment
  const local = useSyncExternalStore(
    subscribeNoop,
    () => {
      if (typeof window === "undefined") return false;
      return (
        ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
        process.env.NEXT_PUBLIC_ADSENSE_FORCE_LIVE !== "true"
      );
    },
    () => false
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || local) return;

    // Mobile slots initialize once at usable width, without waiting for scroll.
    let near =
      isInitialInView ||
      window.matchMedia("(max-width:1024px)").matches ||
      !("IntersectionObserver" in window);

    const fallback = near ? setTimeout(() => setInView(true), 0) : undefined;
    let stopped = false;

    const prepare = () => {
      if (stopped || frozen.current) return;
      if (window.__careAdsenseFailed && !window.__careAdsenseReady) {
        setStatus("failed");
        return;
      }
      if (
        !near ||
        document.visibilityState !== "visible" ||
        (!window.__careAdsenseReady &&
          !window.__adsenseReady &&
          !(typeof window !== "undefined" && window.adsbygoogle))
      ) {
        return;
      }

      const width = node.getBoundingClientRect().width;
      if (width < 120) return;

      frozen.current = true;
      setStatus("pending");

      const isMobile = window.matchMedia("(max-width:1024px)").matches;
      const selectedFormat: AdFormat = isMobile ? mobileFormat : format;

      setConfiguration({
        format: selectedFormat,
        responsive: isMobile || selectedFormat === "auto",
        width: "100%",
        height: compact ? 50 : undefined,
      });
    };

    const resize = new ResizeObserver(prepare);
    resize.observe(node);

    const intersection =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, observer) => {
              if (entries.some((e) => e.isIntersecting)) {
                near = true;
                setInView(true);
                observer.disconnect();
                prepare();
              }
            },
            { rootMargin: "300px 0px" }
          )
        : null;

    intersection?.observe(node);

    window.addEventListener("care-adsense-ready", prepare);
    window.addEventListener("adsense-ready", prepare);
    window.addEventListener("care-adsense-error", prepare);
    window.addEventListener("adsense-error", prepare);
    document.addEventListener("visibilitychange", prepare);

    prepare();

    return () => {
      stopped = true;
      clearTimeout(fallback);
      resize.disconnect();
      intersection?.disconnect();
      window.removeEventListener("care-adsense-ready", prepare);
      window.removeEventListener("adsense-ready", prepare);
      window.removeEventListener("care-adsense-error", prepare);
      window.removeEventListener("adsense-error", prepare);
      document.removeEventListener("visibilitychange", prepare);
    };
  }, [isInitialInView, local, slotId, actualPlacement, format, mobileFormat, compact]);

  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "false") return null;

  const empty =
    status === "unfilled" ||
    status === "failed" ||
    status === "suppressed" ||
    (status === "unfill-optimized" && optimizedEmpty);
  const active = inView && !empty;
  const isHorizontalBanner = configuration ? configuration.format === "horizontal" : format === "horizontal";

  return (
    <aside
      ref={ref}
      aria-label="광고"
      data-ad-placement={actualPlacement}
      data-ad-status={status}
      data-ad-active={active ? "true" : "false"}
      data-ad-compact={compact ? "true" : "false"}
      className={`ad-slot w-full max-w-7xl mx-auto ${compact ? "ad-slot-compact" : ""} ${
        isHorizontalBanner ? "ad-slot-horizontal" : ""
      } ${!active ? "ad-slot-collapsed" : ""} ${mobileOnly ? "md:hidden" : ""} ${className}`}
      style={{
        overflowAnchor: "none",
        margin: active ? (compact ? "4px auto 8px" : "8px auto 14px") : "0 auto",
        minHeight: active ? (compact ? 50 : isHorizontalBanner ? 60 : mobileHeight) : 0,
        height: active ? undefined : 0,
        opacity: active ? 1 : 0,
      }}
    >
      {local ? (
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 border border-dashed border-slate-300 text-xs text-slate-500">
          광고 영역 ({actualPlacement})
        </div>
      ) : configuration ? (
        <GoogleUnit
          configuration={configuration}
          slot={slotId}
          placement={actualPlacement}
          onStatus={setStatus}
          onOptimizedEmpty={setOptimizedEmpty}
        />
      ) : null}
    </aside>
  );
}

export function AdSlot(props: AdSlotProps) {
  const pathname = usePathname();
  return (
    <AdSlotContent
      key={`${pathname}:${props.placement || props.slot}:${props.slot}`}
      {...props}
    />
  );
}

export default function AdBanner(props: AdSlotProps) {
  return <AdSlot {...props} />;
}
