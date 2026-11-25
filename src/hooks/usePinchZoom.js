import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * usePinchZoom
 *
 * Two-finger pinch-to-zoom for a Three.js canvas — the touch equivalent of
 * the mouse-wheel dolly zoom GLTFViewer already wires up behind
 * `enableZoom`. Listens on the canvas directly (independent of the
 * caller's own single-pointer drag-to-rotate handlers) and dollies the
 * camera along z as the distance between two touches changes.
 *
 * Returns `isPinchingRef` so the caller's pointermove handler can skip
 * applying a rotation delta while a pinch is in progress — with pointer
 * capture, both touches' move events would otherwise feed the same
 * single-pointer drag state and produce a garbled rotation.
 *
 * Props:
 *   canvasRef  ref to the canvas element
 *   cameraRef  ref to the THREE.PerspectiveCamera
 *   enabled    boolean  // mirrors `enableZoom` — fullscreen viewer only
 *   zoomMin    number
 *   zoomMax    number
 */
export default function usePinchZoom({ canvasRef, cameraRef, enabled, zoomMin, zoomMax }) {
  const isPinchingRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return

    const touches = new Map()   // pointerId -> {x, y}
    let startDist = 0
    let startZ = 0

    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

    const onPointerDown = (e) => {
      if (e.pointerType !== 'touch') return
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (touches.size === 2) {
        const [a, b] = [...touches.values()]
        startDist = distance(a, b)
        startZ = cameraRef.current?.position.z ?? 0
        isPinchingRef.current = true
      }
    }

    const onPointerMove = (e) => {
      if (!touches.has(e.pointerId)) return
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (!isPinchingRef.current || touches.size !== 2 || startDist <= 0 || !cameraRef.current) return

      const [a, b] = [...touches.values()]
      const scale = startDist / distance(a, b)
      cameraRef.current.position.z = THREE.MathUtils.clamp(startZ * scale, zoomMin, zoomMax)
    }

    const onPointerEnd = (e) => {
      touches.delete(e.pointerId)
      if (touches.size < 2) isPinchingRef.current = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerEnd)
    canvas.addEventListener('pointercancel', onPointerEnd)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerEnd)
      canvas.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [enabled, canvasRef, cameraRef, zoomMin, zoomMax])

  return isPinchingRef
}
