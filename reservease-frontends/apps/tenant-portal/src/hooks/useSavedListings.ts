/**
 * useSavedListings — read/write saved (favourited) listing IDs with
 * optimistic UI updates so the heart animation is instant.
 *
 * Strategy:
 *  - Persists to localStorage immediately (works without an account)
 *  - When logged in, syncs to the backend favorites API in the background
 *  - On API failure, rolls back the optimistic update and shows a toast
 *
 * @returns {object}
 *   savedIds    — Set<string> of currently saved listing IDs
 *   isSaved(id) — true if the listing is in the saved set
 *   toggle(id)  — save or unsave; returns the new saved state
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { favoritesApi } from "@/api/favorites";
import { useToast } from "./use-toast";

const STORAGE_KEY = "re:saved_listings";

function readFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeToStorage(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // quota or private mode
  }
}

export function useSavedListings() {
  const { isLoggedIn } = useAuth();
  const { toast }      = useToast();
  const [savedIds, setSavedIds] = useState<Set<string>>(readFromStorage);

  // Keep storage current
  useEffect(() => {
    writeToStorage(savedIds);
  }, [savedIds]);

  // Pending API ops — prevents duplicate in-flight calls
  const pending = useRef<Set<string>>(new Set());

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggle = useCallback(
    async (listingId: string): Promise<boolean> => {
      if (pending.current.has(listingId)) return savedIds.has(listingId);
      pending.current.add(listingId);

      const wasSaved  = savedIds.has(listingId);
      const willSave  = !wasSaved;

      // Optimistic update — instant UI feedback
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (willSave) next.add(listingId);
        else          next.delete(listingId);
        return next;
      });

      // Sync to backend when authenticated
      if (isLoggedIn) {
        try {
          if (willSave) {
            await favoritesApi.add({ accommodationId: listingId });
          } else {
            await favoritesApi.remove(listingId);
          }
        } catch {
          // Rollback on failure
          setSavedIds((prev) => {
            const rolled = new Set(prev);
            if (wasSaved) rolled.add(listingId);
            else          rolled.delete(listingId);
            return rolled;
          });
          toast({
            title: "Could not update saved listings",
            description: "Please check your connection and try again.",
            variant: "destructive",
          });
          pending.current.delete(listingId);
          return wasSaved;
        }
      }

      pending.current.delete(listingId);
      return willSave;
    },
    [savedIds, isLoggedIn, toast],
  );

  return { savedIds, isSaved, toggle } as const;
}
