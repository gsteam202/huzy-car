"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createAdMeasurement, observeAdSlot, reportAdRequest } from "./care-ad-measurement";
import { observeOptimizedAdSpace } from "./care-ad-space";

// Freeze the layout per content instance. Resize never creates another ad request.
export function useMobileAdLayout() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    setMobile(window.matchMedia("(max-width:1024px)").matches);
  }, []);
  return mobile;
}

type Props = {
  client: string;
  slot: string;
  placement?: string;
  className?: string;
  compact?: boolean;
  resetKey?: string;
  nonPersonalized?: boolean;
};

export function CareMobileAd(props: Props) {
  const pathname = usePathname();
  return (
    <MobileUnit
      key={`${pathname}:${props.slot}:${props.placement ?? ""}:${props.resetKey ?? ""}`}
      {...props}
    />
  );
}

function MobileUnit({
  client,
  slot,
  placement = "mobile-content",
  className = "",
  compact = false,
  nonPersonalized = false,
}: Props) {
  const box = useRef<HTMLElement>(null);
  const ins = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const measurement = useRef(createAdMeasurement());
  const [usable, setUsable] = useState(false);
  const [status, setStatus] = useState("pending");
  const [optimizedEmpty, setOptimizedEmpty] = useState(false);
  const [height] = useState(() =>
    compact
      ? 50
      : typeof window === "undefined"
      ? 100
      : window.innerWidth >= 800
      ? 90
      : window.innerWidth >= 500
      ? 60
      : 100
  );
  const empty =
    status === "unfilled" ||
    status === "failed" ||
    status === "suppressed" ||
    (status === "unfill-optimized" && optimizedEmpty);
  const active = usable && !empty;

  useEffect(() => {
    if (document.getElementById("huzy-car-mobile-ad-style")) return;
    const style = document.createElement("style");
    style.id = "huzy-car-mobile-ad-style";
    style.textContent =
      ".huzy-car-mobile-ad.huzy-car-mobile-ad{width:100%!important;max-width:100%!important;box-sizing:border-box;padding:0!important;margin:6px auto 10px!important;overflow:visible!important;min-height:50px!important;height:auto!important;max-height:none!important;transition:none!important}.huzy-car-mobile-ad[data-ad-compact=true]{min-height:50px!important;margin:4px 0 6px!important}.huzy-car-mobile-ad[data-ad-active=false]{height:0!important;min-height:0!important;max-height:0!important;padding:0!important;margin-block:0!important;border-width:0!important;overflow:hidden!important}";
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const prepare = () => {
      if (document.visibilityState === "visible" && node.getBoundingClientRect().width >= 120) {
        setUsable(true);
      }
    };
    const resize = new ResizeObserver(prepare);
    resize.observe(node);
    document.addEventListener("visibilitychange", prepare);
    prepare();
    return () => {
      resize.disconnect();
      document.removeEventListener("visibilitychange", prepare);
    };
  }, []);

  useEffect(() => {
    const node = ins.current;
    if (!node || !usable) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
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
      if (node.getBoundingClientRect().width < 120) {
        if (++attempts < 15) timer = setTimeout(push, 150);
        return;
      }
      if (node.hasAttribute("data-adsbygoogle-status")) {
        pushed.current = true;
        return;
      }
      try {
        const target = window as unknown as {
          adsbygoogle?: { push: (item: object) => unknown; requestNonPersonalizedAds?: number };
        };
        const queue: { push: (item: object) => unknown; requestNonPersonalizedAds?: number } =
          target.adsbygoogle ?? ([] as object[]);
        if (nonPersonalized) {
          (queue as { requestNonPersonalizedAds?: number }).requestNonPersonalizedAds = 1;
        }
        target.adsbygoogle = queue;
        queue.push({});
        pushed.current = true;
        reportAdRequest({ slot, placement, format: "horizontal" }, measurement.current);
      } catch (error) {
        if (
          /availableWidth\s*=\s*0|No slot size|All 'ins' elements in the DOM/i.test(
            error instanceof Error ? error.message : String(error)
          ) &&
          ++attempts < 15
        ) {
          timer = setTimeout(push, 200);
        } else {
          setStatus("failed");
        }
      }
    };

    const resize = new ResizeObserver(() => {
      if (!pushed.current) push();
    });
    resize.observe(node);
    const wake = () => {
      if (!pushed.current) push();
    };
    document.addEventListener("visibilitychange", wake);
    timer = setTimeout(push, 50);
    const stopStatus = observeAdSlot(
      node,
      { slot, placement, format: "horizontal" },
      measurement.current,
      setStatus
    );
    const stopSpace = observeOptimizedAdSpace(node, setOptimizedEmpty);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      resize.disconnect();
      stopStatus();
      stopSpace();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [usable, slot, placement, nonPersonalized]);

  if (!/^ca-pub-\d{16}$/.test(client) || !/^\d+$/.test(slot)) return null;

  return (
    <aside
      ref={box}
      className={`huzy-car-mobile-ad ${className}`}
      aria-label="광고"
      data-care-mobile-policy="true"
      data-ad-placement={placement}
      data-ad-status={status}
      data-ad-active={active ? "true" : "false"}
      data-ad-visible={status === "filled" ? "true" : empty ? "false" : "pending"}
      data-ad-compact={compact ? "true" : "false"}
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: active ? (compact ? 50 : 60) : 0,
        height: active ? undefined : 0,
        opacity: active ? 1 : 0,
        overflowAnchor: "none",
      }}
    >
      {usable && (
        <ins
          ref={ins}
          className="adsbygoogle ad-banner-horizontal"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            height,
            flexShrink: 0,
          }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-full-width-responsive="false"
        />
      )}
    </aside>
  );
}
