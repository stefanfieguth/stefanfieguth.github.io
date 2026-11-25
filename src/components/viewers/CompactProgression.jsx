import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './CompactProgression.module.css'

// Caps a single frame's time step so a backgrounded tab (where rAF stops)
// doesn't count the whole time away as elapsed hold time on return.
const MAX_FRAME_DT = 100

/**
 * CompactProgression
 *
 * The `compactText` alternative to ProgressionSlider / AlphaSlider: a row of
 * dots where the active one stretches into a progress bar that fills over
 * the time its step is on screen, with the active step's label (if any)
 * crossfading just above it. Always cycles forward, wrapping N-1 → 0.
 *
 * Each step's time is `fadeMs` (transition in from the previous step)
 * followed by `waitMs` (hold); the progress bar covers both. Clicking a dot
 * jumps to that step and restarts its countdown — it does not pause.
 *
 * Props:
 *   labels       (string|undefined)[]  — one entry per step; also sets the step count
 *   paused       boolean  — external pause (e.g. canvas drag, lightbox open)
 *   waitMs       number   — ms to hold at each step
 *   fadeMs       number   — ms for the transition into each step (0 = hard switch)
 *   initialIndex number   — step to start on (default 0)
 *   onStep       (index: number) => void  — called whenever the active step changes
 *   onFrame      ({ from, to, fade }) => void  — called every running frame with the
 *                two steps being blended and the blend factor (0 = fully `from`,
 *                1 = fully `to`). Optional; only needed by crossfading parents.
 */
export default function CompactProgression({
  labels = [],
  paused = false,
  waitMs = 2500,
  fadeMs = 600,
  initialIndex = 0,
  onStep,
  onFrame,
}) {
  const count = labels.length

  const [view, setView] = useState({ index: initialIndex, progress: 0 })
  const stateRef    = useRef({ from: initialIndex, to: initialIndex, elapsed: 0 })
  const pausedRef   = useRef(paused)
  const timingRef   = useRef({ waitMs, fadeMs })
  const onStepRef   = useRef(onStep)
  const onFrameRef  = useRef(onFrame)
  // Synced every render so the rAF loop never goes stale without restarting
  pausedRef.current  = paused
  timingRef.current  = { waitMs, fadeMs }
  onStepRef.current  = onStep
  onFrameRef.current = onFrame

  const emit = useCallback(() => {
    const s = stateRef.current
    const { waitMs: w, fadeMs: f } = timingRef.current
    const total = Math.max(1, w + f)
    const fade  = f > 0 ? Math.min(1, s.elapsed / f) : 1
    onFrameRef.current?.({ from: s.from, to: s.to, fade })
    setView({ index: s.to, progress: Math.min(1, s.elapsed / total) })
  }, [])

  useEffect(() => {
    if (count <= 1) return
    let raf
    let last = null

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = last === null ? 0 : Math.min(now - last, MAX_FRAME_DT)
      last = now
      if (pausedRef.current) return

      const s = stateRef.current
      const { waitMs: w, fadeMs: f } = timingRef.current
      s.elapsed += dt
      if (s.elapsed >= w + f) {
        s.from    = s.to
        s.to      = (s.to + 1) % count
        s.elapsed = 0
        onStepRef.current?.(s.to)
      }
      emit()
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, emit])

  const select = useCallback((i) => {
    const s = stateRef.current
    const { fadeMs: f } = timingRef.current
    const fade = f > 0 ? Math.min(1, s.elapsed / f) : 1
    // Blend out of whichever step is currently the more visible one
    s.from    = fade < 0.5 ? s.from : s.to
    s.to      = i
    s.elapsed = 0
    onStepRef.current?.(i)
    emit()
  }, [emit])

  const hasText = labels.some(Boolean)

  return (
    <div className={styles.container}>
      {hasText && (
        <div className={styles.text}>
          {labels.map((label, i) => (
            <span
              key={i}
              className={`${styles.textItem} ${i === view.index ? styles.textActive : ''}`}
              aria-hidden={i !== view.index}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className={styles.dots}>
        {labels.map((label, i) => {
          const active = i === view.index
          const past   = i < view.index
          return (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${active ? styles.dotActive : ''} ${past ? styles.dotPast : ''}`}
              onClick={() => select(i)}
              aria-label={`Show ${label ?? `step ${i + 1}`}`}
              aria-current={active || undefined}
            >
              {/* Rendered on every dot so that when the active step is left
                  for an earlier one (the N-1 → 0 wrap, or clicking back) its
                  full bar fades out instead of unmounting instantly. Inactive
                  dots park it at full width so the fade starts from full. */}
              {count > 1 && (
                <span
                  className={`${styles.progress} ${active ? styles.progressOn : ''}`}
                  style={{ transform: `scaleX(${active ? view.progress : 1})` }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
