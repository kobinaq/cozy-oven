"use client";

import { useEffect, useRef, useState } from "react";
import { warmUpApi } from "../services/apiClient";

type WarmupState = "idle" | "warming" | "ready" | "failed";

const WARMUP_VISIBILITY_DELAY_MS = 1200;

export default function ApiWarmupBanner() {
  const [state, setState] = useState<WarmupState>("idle");
  const [showBanner, setShowBanner] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let cancelled = false;
    const visibilityTimer = window.setTimeout(() => {
      if (!cancelled) {
        setShowBanner(true);
        setState("warming");
      }
    }, WARMUP_VISIBILITY_DELAY_MS);

    const warm = async () => {
      try {
        await warmUpApi();
        if (cancelled) return;
        window.clearTimeout(visibilityTimer);
        setState("ready");
        window.setTimeout(() => {
          if (!cancelled) setShowBanner(false);
        }, 900);
      } catch (error) {
        console.error("API warm-up failed:", error);
        if (cancelled) return;
        setState("failed");
        setShowBanner(true);
      }
    };

    warm();

    return () => {
      cancelled = true;
      window.clearTimeout(visibilityTimer);
    };
  }, []);

  if (!showBanner) return null;

  const isReady = state === "ready";
  const isFailed = state === "failed";

  return (
    <div className="fixed left-1/2 top-3 z-[80] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg">
      <div className="flex items-center gap-3">
        {!isReady && !isFailed && (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#bd6325] border-r-transparent" />
        )}
        <div>
          <p className="font-semibold">
            {isReady
              ? "Bakery is ready"
              : isFailed
              ? "Still warming up"
              : "Warming up the bakery..."}
          </p>
          <p className="text-xs text-gray-600">
            {isFailed
              ? "Please give us a moment and try again."
              : isReady
              ? "Fresh data is available."
              : "We will be with you shortly."}
          </p>
        </div>
      </div>
    </div>
  );
}
