import { useState, useRef, useCallback, useEffect } from 'react';

export function useStopwatch(tickMs = 50) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);       // timestamp of current run segment
  const accumRef = useRef(0);       // time banked from previous segments
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return; // idempotent
    startRef.current = performance.now();
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(accumRef.current + (performance.now() - startRef.current));
    }, tickMs);
  }, [tickMs]);

  const stop = useCallback(() => {
    if (intervalRef.current === null) return elapsed;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    accumRef.current += performance.now() - startRef.current;
    setElapsed(accumRef.current);
    setRunning(false);
    return accumRef.current; // exact final time, not the throttled display value
  }, [elapsed]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    accumRef.current = 0;
    setElapsed(0);
    setRunning(false);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { elapsed, running, start, stop, reset };
}