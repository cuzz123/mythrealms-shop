"use client";

import { useCallback, useSyncExternalStore } from "react";

export type HeaderVisualState = "overlay" | "solid";

export function getHeaderVisualState(
  pathname: string,
  scrollY: number,
  viewportHeight: number,
): HeaderVisualState {
  if (pathname !== "/") return "solid";
  return scrollY > viewportHeight * 0.5 ? "solid" : "overlay";
}

export function takePendingMenuFocus<T extends string>(
  pendingMenu: T | null,
  openMenu: T | null,
): T | null {
  return pendingMenu && pendingMenu === openMenu ? pendingMenu : null;
}

export function useHeaderVisualState(pathname: string): HeaderVisualState {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (pathname !== "/") return () => undefined;
      window.addEventListener("scroll", notify, { passive: true });
      return () => window.removeEventListener("scroll", notify);
    },
    [pathname],
  );
  const getSnapshot = useCallback(
    () => getHeaderVisualState(pathname, window.scrollY, window.innerHeight),
    [pathname],
  );
  const getServerSnapshot = useCallback(
    () => getHeaderVisualState(pathname, 0, 1),
    [pathname],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
