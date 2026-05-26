import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'tokenstats_results_pane_percent';
const DEFAULT_PERCENT = 40;
const MIN_PERCENT = 20;
const MAX_PERCENT = 80;

function readStoredPercent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = Number(raw);
    if (Number.isFinite(n) && n >= MIN_PERCENT && n <= MAX_PERCENT) return n;
  } catch {
    /* ignore */
  }
  return DEFAULT_PERCENT;
}

function storePercent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* ignore */
  }
}

/**
 * Vertical split: editor (top) + results (bottom). Drag handle adjusts results pane %.
 */
export function useResizablePane(containerRef) {
  const [resultsPercent, setResultsPercent] = useState(readStoredPercent);
  const percentRef = useRef(resultsPercent);

  useEffect(() => {
    percentRef.current = resultsPercent;
  }, [resultsPercent]);

  const clamp = useCallback(
    (value) => Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value)),
    []
  );

  const adjustBy = useCallback(
    (delta) => {
      setResultsPercent((prev) => {
        const next = clamp(prev + delta);
        storePercent(next);
        return next;
      });
    },
    [clamp]
  );

  const onResizePointerDown = useCallback(
    (event) => {
      event.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const startY = event.clientY;
      const startPercent = percentRef.current;
      const rect = container.getBoundingClientRect();

      const onPointerMove = (moveEvent) => {
        const deltaY = startY - moveEvent.clientY;
        const deltaPercent = (deltaY / rect.height) * 100;
        const next = clamp(startPercent + deltaPercent);
        percentRef.current = next;
        setResultsPercent(next);
      };

      const onPointerUp = () => {
        storePercent(percentRef.current);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [clamp, containerRef]
  );

  const onResizeKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        adjustBy(5);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        adjustBy(-5);
      } else if (event.key === 'Home') {
        event.preventDefault();
        const next = MIN_PERCENT;
        storePercent(next);
        setResultsPercent(next);
      } else if (event.key === 'End') {
        event.preventDefault();
        const next = MAX_PERCENT;
        storePercent(next);
        setResultsPercent(next);
      }
    },
    [adjustBy]
  );

  return {
    resultsPercent,
    onResizePointerDown,
    onResizeKeyDown,
  };
}
