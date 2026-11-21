import { useEffect, useRef } from 'react';

const VIBRATE_PATTERN = [500, 300, 500];
const CYCLE_MS = VIBRATE_PATTERN.reduce((a, b) => a + b, 0);
const VIBRATE_DURATION_MS = 5 * 60 * 1000;

// Continuously vibrates while the patient's appointment is `called`.
// Stops on state change, timeout, or when the patient mutes it.
export function useCalledVibration(isCalled: boolean, muted: boolean) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;
    if (!supportsVibration) return;

    if (isCalled && !muted) {
      navigator.vibrate(VIBRATE_PATTERN);
      intervalRef.current = setInterval(() => {
        navigator.vibrate(VIBRATE_PATTERN);
      }, CYCLE_MS);

      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        navigator.vibrate(0);
      }, VIBRATE_DURATION_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      navigator.vibrate(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      navigator.vibrate(0);
    };
  }, [isCalled, muted]);
}
