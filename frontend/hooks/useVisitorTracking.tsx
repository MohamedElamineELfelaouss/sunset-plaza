"use client"

import { useEffect, useRef } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

/**
 * Hook to track visitors silently in background.
 * Call this once at app root level.
 */
export function useVisitorTracking() {
    const tracked = useRef(false)

    useEffect(() => {
        // Only track once per session
        if (tracked.current) return
        tracked.current = true

        const trackVisit = async () => {
            try {
                await fetch(`${API_BASE}/api/analytics/track/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        page: window.location.pathname + window.location.hash,
                        referrer: document.referrer || "",
                    }),
                })
            } catch {
                // Silently fail - never interrupt user
            }
        }

        // Small delay to not block initial render
        const timer = setTimeout(trackVisit, 1000)
        return () => clearTimeout(timer)
    }, [])
}

/**
 * Component version - just include in layout
 */
export function VisitorTracker() {
    useVisitorTracking()
    return null
}
