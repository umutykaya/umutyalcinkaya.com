import { useState, useSyncExternalStore } from "react";
import type { RateLimitInfo } from "@/types/github";

let rateLimitInfo: RateLimitInfo = { remaining: -1, limit: -1, resetAt: 0 };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function updateRateLimit(headers: Headers) {
  const remaining = headers.get("X-RateLimit-Remaining");
  const limit = headers.get("X-RateLimit-Limit");
  const reset = headers.get("X-RateLimit-Reset");

  if (remaining !== null && limit !== null && reset !== null) {
    rateLimitInfo = {
      remaining: parseInt(remaining, 10),
      limit: parseInt(limit, 10),
      resetAt: parseInt(reset, 10),
    };
    notify();
  }
}

export function getRateLimitInfo(): RateLimitInfo {
  return rateLimitInfo;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): RateLimitInfo {
  return rateLimitInfo;
}

export function useRateLimit(): RateLimitInfo {
  return useSyncExternalStore(subscribe, getSnapshot);
}
