import { useEffect, useRef, useCallback } from 'react'
import styles from './ProgressionSlider.module.css'

/**
 * AlphaSlider
 *
 * An N-stage slider that, by default, bounces back and forth:
 *   0 → 1 → 2 → … → N-1 → N-2 → … → 1 → 0 → repeat
 * With `loop`, it instead cycles forward, wrapping N-1 → 0:
 *   0 → 1 → 2 → … → N-1 → 0 → 1 → …
 * During the wrap the value runs N-1 → N (callers treat N as step 0 again,
 * e.g. crossfading the last image into the first), then snaps to 0.
 *
 * Pauses at every integer stage for `waitMs` before animating to the next.
 * The controlled `value` prop is a fractional position in 0..N-1.
 *
 * Semantics when used for internal mode:
 *   position 0   = all models fully opaque (outer shell view)
 *   position N-1 = outermost models at their translucent opacity (inner view)
 *
 * Props:
 *   value     number    — controlled fractional position (0..N-1)
 *   onChange  fn        — (pos: number) => void
 *   labels    string[]  — N labels rendered left → right
 *   paused    boolean   — external pause (e.g. canvas drag)
 *   waitMs    number    — ms to hold at each integer stage
 *   fadeMs    number    — ms to animate between consecutive stages
 *   showLabels boolean  — render the label row above the track (default true)
 *   loop      boolean   — cycle forward with wraparound instead of bouncing (default false)
 */
export default function AlphaSlider({
  value,
  onChange,
  labels = [],
  paused = false,
  waitMs = 2500,
  fadeMs = 600,
  showLabels = true,
  loop = false,
}) {
  const count = labels.length

  const trackRef          = useRef(null)
  const rafRef            = useRef(null)
  const internalPausedRef = useRef(false)
  const externalPausedRef = useRef(paused)
  const isDraggingRef     = useRef(false)
  const onChangeRef       = useRef(onChange)
  const valueRef          = useRef(value)
  // Keep in sync on every render (no useEffect overhead)
  onChangeRef.current     = onChange
  valueRef.current        = value
  externalPausedRef.current = paused

  // Animation state machine
  const stateRef = useRef({
    stage:      0,
    direction:  1,      // +1 (forward) or -1 (backward)
    phase:      'waiting',
    phaseStart: null,
  })

  // N-stage bounce (0→1→…→N-1→N-2→…→0) or, with `loop`, forward cycle (0→…→N-1→0)
  useEffect(() => {
    if (count <= 1) return

    stateRef.current = { stage: 0, direction: 1, phase: 'waiting', phaseStart: null }

    const tick = (now) => {
      rafRef.current = requestAnimationFrame(tick)
      if (internalPausedRef.current || externalPausedRef.current) return

      const s = stateRef.current
      if (s.phaseStart === null) s.phaseStart = now
      const elapsed = now - s.phaseStart

      if (s.phase === 'waiting') {
        if (elapsed >= waitMs) {
          // Flip direction if we've hit an endpoint (bounce mode only)
          const peek = s.stage + s.direction
          if (!loop && (peek < 0 || peek >= count)) s.direction = -s.direction
          s.phase      = 'animating'
          s.phaseStart = now
        }
      } else {
        const t   = Math.min(elapsed / fadeMs, 1)
        const pos = s.stage + t * s.direction
        if (t >= 1) {
          s.stage       = loop ? (s.stage + s.direction) % count : s.stage + s.direction
          s.phase       = 'waiting'
          s.phaseStart  = now
          onChangeRef.current(s.stage)
        } else {
          onChangeRef.current(Math.max(0, Math.min(loop ? count : count - 1, pos)))
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [count, waitMs, fadeMs, loop])

  // ── Drag interaction ──────────────────────────────────────────────────────────

  const posFromPointer = useCallback((clientX) => {
    const track = trackRef.current
    if (!track) return 0
    const { left, width } = track.getBoundingClientRect()
    const frac = Math.max(0, Math.min(1, (clientX - left) / width))
    return frac * Math.max(1, count - 1)
  }, [count])

  const onPointerDown = useCallback((e) => {
    isDraggingRef.current     = true
    internalPausedRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    onChangeRef.current(posFromPointer(e.clientX))
  }, [posFromPointer])

  const onPointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    onChangeRef.current(posFromPointer(e.clientX))
  }, [posFromPointer])

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const cur      = valueRef.current
    const curStage = Math.round(Math.max(0, Math.min(count - 1, cur)))
    // Snap the displayed value to the integer stage immediately, rather
    // than leaving it at the raw drag position until the next animation
    // frame reaches it.
    onChangeRef.current(curStage)
    // Resume animation from current stage — bounce heads toward the far
    // end, loop always continues forward
    stateRef.current = {
      stage:      curStage,
      direction:  !loop && curStage >= count - 1 ? -1 : 1,
      phase:      'waiting',
      phaseStart: null,
    }
    setTimeout(() => {
      internalPausedRef.current   = false
      stateRef.current.phaseStart = performance.now()
    }, 800)
  }, [count, loop])

  // ── Label click ───────────────────────────────────────────────────────────────

  const onLabelClick = useCallback((targetStage) => {
    internalPausedRef.current = true
    onChangeRef.current(targetStage)
    stateRef.current = {
      stage:      targetStage,
      direction:  !loop && targetStage >= count - 1 ? -1 : 1,
      phase:      'waiting',
      phaseStart: null,
    }
    setTimeout(() => {
      internalPausedRef.current   = false
      stateRef.current.phaseStart = performance.now()
    }, waitMs)
  }, [count, waitMs, loop])

  // Thumb position as a % of track width (value is 0..N-1). During a loop
  // wrap (value N-1..N) the thumb sweeps back from the end to the start in
  // step with the last→first transition.
  const max         = Math.max(1, count - 1)
  const thumbValue  = value <= count - 1 ? value : max * (1 - (value - (count - 1)))
  const thumbPct    = count > 1 ? `${(Math.max(0, thumbValue) / max) * 100}%` : '0%'
  const activeStage = loop
    ? Math.round(Math.max(0, Math.min(count, value))) % Math.max(1, count)
    : Math.round(Math.max(0, Math.min(count - 1, value)))

  return (
    <div className={styles.container}>
      {showLabels && count > 0 && (
        <div className={styles.labels}>
          {labels.map((lbl, i) => (
            <button
              key={i}
              className={`${styles.label} ${i === activeStage ? styles.labelActive : ''}`}
              onClick={() => onLabelClick(i)}
            >
              {lbl}
            </button>
          ))}
        </div>
      )}

      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className={styles.fill}  style={{ width: thumbPct }} />
        <div className={styles.thumb} style={{ left:  thumbPct }} />
        {count > 1 && labels.map((_, i) => (
          <div
            key={i}
            className={styles.tick}
            style={{ left: `${(i / (count - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}
