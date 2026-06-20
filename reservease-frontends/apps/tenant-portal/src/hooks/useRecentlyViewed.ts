/**
 * useRecentlyViewed — tracks listing IDs the tenant has opened, stored in
 * localStorage and optionally synced to account (when logged in, the
 * dashboard can show "Continue where you left off").
 *
 * @returns {object}
 *   ids         — ordered array of listing IDs, most recent first (max 20)
 *   record(id)  — call on listing detail mount to register a view
 *   clear()     — wipe the history
 */

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "re:recently_viewed";
const MAX_ITEMS   = 20;

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded)
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(readFromStorage);

  // Keep storage in sync whenever the array changes
  useEffect(() => {
    writeToStorage(ids);
  }, [ids]);

  const record = useCallback((id: string) => {
    setIds((prev) => {
      const without = prev.filter((existing) => existing !== id);
      return [id, ...without].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
  }, []);

  return { ids, record, clear } as const;
}
