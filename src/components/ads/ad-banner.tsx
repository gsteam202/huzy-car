"use client";

import { memo, useEffect, useRef, useState } from "react";
import { CareMobileAd, useMobileAdLayout } from "@/lib/adsense/care-mobile-ad";
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

export const GoogleAdUnit = memo(function GoogleAdUnit({
  slot,
  placement,
  client = ADSENSE_CLIENT_ID,
  format = "auto",
  responsive = true,
  minWidth = 120,
  style,
  className = "",
  onStatus,
  onOptimizedEmpty,
}: {
  slot: string;
  placement: string;
  client?: string;
  format?: string;
  responsive?: boolean;
  minWidth?: number;
  style?: React.CSSProperties;
  className?: string;
  onStatus?: (value: string) => void;
  onOptimizedEmpty?: (value: boolean) => void;
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
      if (currentWidth < minWidth) {
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
        reportAdRequest({ slot, placement, format }, measurement.current);
      } catch (error) {
        if (
          /availableWidth\s*=\s*0|No slot size|All 'ins' elements in the DOM/i.test(
            error instanceof Error ? error.message : String(error)
          ) &&
          ++attempts < maxAttempts
        ) {
          timer = setTimeout(push, 200);
        } else {
          statusCallback.current?.("failed");
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
      { slot, placement, format },
      measurement.current,
      (val) => statusCallback.current?.(val)
    );
    const stopSpace = onOptimizedEmpty
      ? observeOptimizedAdSpace(node, onOptimizedEmpty)
      : () => {};

    return () => {
      cancelled = true;
      clearTimeout(timer);
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", wake);
      stopStatus();
      stopSpace();
    };
  }, [slot, placement, client, format, minWidth, onOptimizedEmpty]);

  return (
    <ins
      ref={ins}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        width: "100%",
        margin: "0 auto",
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
});

export function DesktopAdSlot({
  slot = "content-mid-slot",
  format = "auto",
  mobileOnly = false,
  compact = false,
  className = "",
}: {
  slot?: string;
  format?: string;
  mobileOnly?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const container = useRef<HTMLElement>(null);
  const isTop = slot.endsWith("-top") || slot === "page-top-slot";
  const [inView, setInView] = useState(() => isTop);
  const [status, setStatus] = useState("pending");
  const [optimizedEmpty, setOptimizedEmpty] = useState(false);

  const slotId = SLOTS[slot] || (/^\d{10}$/.test(slot) ? slot : "1689592358");

  useEffect(() => {
    const target = container.current;
    if (!target || !slotId || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [slotId, inView]);

  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "false") return null;

  const empty =
    status === "unfilled" ||
    status === "failed" ||
    status === "suppressed" ||
    (status === "unfill-optimized" && optimizedEmpty);
  const active = inView && !empty;

  return (
    <aside
      ref={container}
      aria-label="광고 영역"
      data-ad-placement={slot}
      data-ad-status={status}
      style={{
        minHeight: active ? (compact ? 90 : 120) : 0,
        height: active ? undefined : 0,
        opacity: active ? 1 : 0,
        overflow: active ? "visible" : "hidden",
      }}
      className={`my-6 w-full max-w-7xl mx-auto px-4 ${
        mobileOnly ? "hidden" : ""
      } ${className}`}
    >
      {inView && (
        <GoogleAdUnit
          slot={slotId}
          placement={slot}
          format={format}
          onStatus={setStatus}
          onOptimizedEmpty={setOptimizedEmpty}
        />
      )}
    </aside>
  );
}

function MobileBanner(props: Parameters<typeof DesktopAdSlot>[0]) {
  const slot =
    SLOTS[props.slot || "content-mid-slot"] ||
    (/^\d{10}$/.test(props.slot || "") ? props.slot! : "1689592358");
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "false" || !slot) return null;
  return (
    <CareMobileAd
      client={ADSENSE_CLIENT_ID}
      slot={slot}
      placement={props.slot}
      compact={props.compact}
      className={[props.mobileOnly ? "md:hidden" : "", props.className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default function AdBanner(props: Parameters<typeof DesktopAdSlot>[0]) {
  const mobile = useMobileAdLayout();
  if (mobile === null) return null;
  return mobile ? <MobileBanner {...props} /> : <DesktopAdSlot {...props} />;
}
