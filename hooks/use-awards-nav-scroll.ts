'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseAwardsNavScrollResult {
  activeSlug: string
  scrollTo: (slug: string) => void
}

/**
 * Tracks which award section is visible (IntersectionObserver) and
 * handles smooth-scroll on menu click. Also reads the URL hash on mount
 * so deep-links from the home page (/awards-information#top-talent) work.
 */
export function useAwardsNavScroll(slugs: string[]): UseAwardsNavScrollResult {
  // Lazy initializer reads URL hash on first render (client-only, avoids setState-in-effect)
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window === 'undefined') return slugs[0] ?? ''
    const hash = window.location.hash.replace('#', '')
    return hash && slugs.includes(hash) ? hash : (slugs[0] ?? '')
  })
  // Flag to pause the observer briefly after a programmatic scroll
  const scrollingRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: scroll to initial hash section (state already set by lazy initializer)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    if (hash && slugs.includes(hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — mount-only; SLUGS is a stable module-level constant

  // IntersectionObserver — update active slug as sections scroll into view
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    slugs.forEach((slug) => {
      const el = document.getElementById(slug)
      if (!el) return

      // rootMargin fires when the section top enters the middle 20%–80% of the
      // viewport — works even when a block is taller than the viewport height.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (scrollingRef.current) return
          if (entry.isIntersecting) {
            setActiveSlug(slug)
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [slugs])

  const scrollTo = useCallback(
    (slug: string) => {
      setActiveSlug(slug)
      scrollingRef.current = true

      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' })

      // Re-enable observer after scroll animation completes (~800ms)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        scrollingRef.current = false
      }, 800)
    },
    []
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { activeSlug, scrollTo }
}
