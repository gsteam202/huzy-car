/** Observe our ad elements only; never inspect or click advertising iframes. */
export type AdPlacement = { slot: string; placement: string; format: string };
export type AdMeasurement = { requested: boolean; statuses: Set<string>; viewable: boolean };
export const createAdMeasurement = (): AdMeasurement => ({ requested: false, statuses: new Set(), viewable: false });

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function reportAdEvent(name: string, ad: AdPlacement, extra: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const target = window as AnalyticsWindow;
  const enqueue: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params
    (target.dataLayer ??= []).push(arguments);
  };
  (target.gtag ?? enqueue)("event", name, {
    ad_slot: ad.slot,
    ad_placement: ad.placement,
    ad_format: ad.format,
    viewport_width: window.innerWidth,
    non_interaction: true,
    ...extra,
  });
}

export function reportAdRequest(ad: AdPlacement, state: AdMeasurement) {
  if (state.requested) return;
  state.requested = true;
  reportAdEvent("adsense_slot_request", ad);
}

export function observeAdSlot(
  node: HTMLElement,
  ad: AdPlacement,
  state: AdMeasurement,
  onStatus?: (status: string) => void
) {
  let status = "";
  let inView = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const updateVisibility = () => {
    cancel();
    if (state.viewable || status !== "filled" || !inView || document.visibilityState !== "visible") return;
    timer = setTimeout(() => {
      timer = undefined;
      if (status !== "filled" || !inView || document.visibilityState !== "visible") return;
      state.viewable = true;
      reportAdEvent("adsense_slot_viewable", ad, { ad_status: status, visible_seconds: 1 });
    }, 1000);
  };
  const readStatus = () => {
    const next = node.classList.contains("adsbygoogle-ablated-ad-slot")
      ? "suppressed"
      : node.getAttribute("data-ad-status") ?? "";
    if (!["filled", "unfilled", "unfill-optimized", "suppressed"].includes(next) || next === status) return;
    status = next;
    onStatus?.(status);
    if (!state.statuses.has(status)) {
      state.statuses.add(status);
      reportAdEvent(status === "suppressed" ? "adsense_slot_suppressed" : "adsense_slot_render", ad, {
        ad_status: status,
      });
    }
    updateVisibility();
  };
  const mutations = new MutationObserver(readStatus);
  mutations.observe(node, { attributes: true, attributeFilter: ["data-ad-status", "class"] });
  const intersection =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          ([entry]) => {
            inView = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.5);
            updateVisibility();
          },
          { threshold: [0, 0.5, 1] }
        );
  intersection?.observe(node);
  document.addEventListener("visibilitychange", updateVisibility);
  readStatus();
  return () => {
    cancel();
    mutations.disconnect();
    intersection?.disconnect();
    document.removeEventListener("visibilitychange", updateVisibility);
  };
}
