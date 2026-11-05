/** Observe the outer slot only. Never read an ad iframe or refresh a request. */
export function observeOptimizedAdSpace(
  node: HTMLElement,
  onEmpty: (empty: boolean) => void
) {
  let frame: number | undefined;
  let previous: boolean | undefined;
  const read = () => {
    frame = undefined;
    const optimized = node.dataset.adStatus === "unfill-optimized";
    const style = getComputedStyle(node);
    const visible =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      node.getBoundingClientRect().height > 0;

    const content = Array.from(node.children).some((child) => {
      const bounds = child.getBoundingClientRect();
      const childStyle = getComputedStyle(child);
      return (
        bounds.width > 0 &&
        bounds.height > 0 &&
        childStyle.display !== "none" &&
        childStyle.visibility !== "hidden" &&
        (child.hasChildNodes() ||
          child.shadowRoot !== null ||
          child.matches("iframe, img, svg, canvas, object, embed"))
      );
    });
    const empty = optimized && (!visible || !content);
    if (empty !== previous) {
      previous = empty;
      onEmpty(empty);
    }
  };
  const schedule = () => {
    if (frame === undefined) frame = requestAnimationFrame(read);
  };
  const mutations = new MutationObserver(schedule);
  mutations.observe(node, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-ad-status", "style", "class", "hidden"],
  });
  const resize = new ResizeObserver(schedule);
  resize.observe(node);
  read();
  return () => {
    mutations.disconnect();
    resize.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
  };
}
