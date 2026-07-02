import { useEffect } from "react";

function isScrollableMenuTarget(target: EventTarget | null) {
  let node = target instanceof HTMLElement ? target : null;
  while (node) {
    if (node.dataset.scrollLockScrollable !== undefined) return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Locks background scroll without position:fixed or scrollTo restore —
 * avoids the jump when opening/closing mobile overlays on iOS/Android.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById("root");

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyTouchAction = body.style.touchAction;
    const prevRootOverflow = root?.style.overflow ?? "";

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";
    if (root) root.style.overflow = "hidden";

    html.classList.add("scroll-locked");

    const blockScroll = (event: Event) => {
      if (isScrollableMenuTarget(event.target)) return;
      event.preventDefault();
    };

    document.addEventListener("touchmove", blockScroll, { passive: false });
    document.addEventListener("wheel", blockScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", blockScroll);
      document.removeEventListener("wheel", blockScroll);

      html.classList.remove("scroll-locked");
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.touchAction = prevBodyTouchAction;
      if (root) root.style.overflow = prevRootOverflow;
    };
  }, [locked]);
}
