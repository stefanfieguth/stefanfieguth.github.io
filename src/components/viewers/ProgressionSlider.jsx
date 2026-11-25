import { useState, useCallback, useRef } from 'react'
import useAutoPlay from '../../hooks/useAutoPlay.js'
import styles from './ProgressionSlider.module.css'

/**
 * ProgressionSlider
 *
 * A slider that auto-advances through a list of steps.
 * Used inside GLTFViewer (progression mode) and by PhotoProgression.
 *
 * Props:
 *   steps              { label: string }[]   — step definitions
 *   currentIndex       number                — controlled current step
 *   onChange           (index: number) => void
 *   onSliderPosition   (pos: number) => void  — fractional position every frame
 *   paused             boolean               — external pause (e.g. canvas drag)
 *   waitMs             number  — ms to hold at each step
 *   fadeMs             number  — ms for the position animation
 *   showLabels         boolean — render the step-name row above the track (default true).
 *                                Set false at small rendered sizes (e.g. inside a grid
 *                                item) where labels would overflow or clutter.
 */
export default function ProgressionSlider({
  steps,
  currentIndex,
  onChange,
  onSliderPosition,
  paused = false,
  waitMs = 2500,
  fadeMs = 600,
  showLabels = true,
}) {
  const [sliderPos, setSliderPos]     = useState(0)   // fractional 0..N-1
  const [isInteracting, setIsInteracting] = useState(false)
  const isDraggingRef                 = useRef(false)
  const trackRef                      = useRef(null)
  const onSliderPositionRef           = useRef(onSliderPosition)
  onSliderPositionRef.current         = onSliderPosition

  const count = steps.length

  const effectivePaused = paused || isInteracting

  // Auto-play drives sliderPos and calls onChange at each integer step
  const { seek } = useAutoPlay({
    count,
    waitMs,
    animMs: fadeMs,
    paused: effectivePaused,
    onStep:     (idx) => onChange(idx),
    onPosition: (pos) => {
      if (!isDraggingRef.current) {
        setSliderPos(pos)
        onSliderPositionRef.current?.(pos)
      }
    },
  })

  // ── Manual drag ────────────────────────────────────────────────────────────
  const posFromPointer = useCallback((clientX) => {
    const track = trackRef.current
    if (!track) return 0
    const { left, width } = track.getBoundingClientRect()
    const t = Math.max(0, Math.min(1, (clientX - left) / width))
    return t * (count - 1)
  }, [count])

  const onTrackPointerDown = useCallback((e) => {
    isDraggingRef.current = true
    setIsInteracting(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const pos = posFromPointer(e.clientX)
    setSliderPos(pos)
    onSliderPositionRef.current?.(pos)
    onChange(Math.round(pos))
  }, [posFromPointer, onChange])

  const onTrackPointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    const pos = posFromPointer(e.clientX)
    setSliderPos(pos)
    onSliderPositionRef.current?.(pos)
    onChange(Math.round(pos))
  }, [posFromPointer, onChange])

  const onTrackPointerUp = useCallback(() => {
    isDraggingRef.current = false
    const snapped = Math.round(sliderPos)
    setSliderPos(snapped)
    onSliderPositionRef.current?.(snapped)
    // Re-point auto-play's cursor so it resumes from here, not from
    // wherever it was automatically before the user grabbed the slider.
    seek(snapped)
    // Resume auto-play after a short grace period
    setTimeout(() => setIsInteracting(false), 800)
  }, [sliderPos, seek])

  // Thumb position as a percentage of track width
  const thumbPct = count > 1 ? (sliderPos / (count - 1)) * 100 : 0

  return (
    <div className={styles.container}>
      {/* Step number labels */}
      {showLabels && (
        <div className={styles.labels}>
          {steps.map((step, i) => (
            <button
              key={i}
              className={`${styles.label} ${i === currentIndex ? styles.labelActive : ''}`}
              onClick={() => {
                setIsInteracting(true)
                setSliderPos(i)
                onSliderPositionRef.current?.(i)
                onChange(i)
                seek(i)
                setTimeout(() => setIsInteracting(false), waitMs)
              }}
            >
              {step.label ?? i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={onTrackPointerUp}
        onPointerLeave={onTrackPointerUp}
      >
        {/* Filled portion */}
        <div
          className={styles.fill}
          style={{ width: `${thumbPct}%` }}
        />
        {/* Thumb */}
        <div
          className={styles.thumb}
          style={{ left: `${thumbPct}%` }}
        />
        {/* Step tick marks */}
        {steps.map((_, i) => (
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
