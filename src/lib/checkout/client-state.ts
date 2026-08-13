export interface KeyedValue<T> {
  key: string;
  value: T | null;
}

export function getKeyedValue<T>(state: KeyedValue<T>, currentKey: string): T | null {
  return state.key === currentKey ? state.value : null;
}

export const PAYPAL_UNAVAILABLE_MESSAGE =
  "PayPal could not be loaded. Please refresh and try again.";

export function schedulePayPalUnavailable(
  report: (message: string) => void,
  schedule: (callback: () => void) => void = queueMicrotask,
): () => void {
  let active = true;
  schedule(() => {
    if (active) report(PAYPAL_UNAVAILABLE_MESSAGE);
  });
  return () => {
    active = false;
  };
}
