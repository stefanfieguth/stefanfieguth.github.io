import { useRef, useCallback } from 'react'
import * as THREE from 'three'

/**
 * useQuaternion
 *
 * Manages the rotation state of the 3D viewer as a quaternion.
 * Exposes helpers for:
 *   - initialising from euler angles (user config)
 *   - applying auto-rotation around the world Y axis
 *   - applying pointer-drag deltas (via an arcball-style calculation)
 *
 * Keeping the canonical state as a quaternion prevents gimbal lock and
 * allows the user to rotate freely over the poles.
 */
export default function useQuaternion(initialEuler = [0, 0, 0]) {
  // Canonical rotation state — a THREE.Quaternion stored in a ref so
  // mutations do not cause re-renders. The Three.js mesh reads this
  // directly each frame in the render loop.
  const quaternionRef = useRef(() => {
    const euler = new THREE.Euler(...initialEuler, 'XYZ')
    return new THREE.Quaternion().setFromEuler(euler)
  })

  // Lazily initialise the quaternion on first access
  if (typeof quaternionRef.current === 'function') {
    quaternionRef.current = quaternionRef.current()
  }

  /**
   * applyAutoRotation
   * Called each animation frame when the user is not dragging.
   * Rotates by (speed * deltaTime) radians — around the world Y axis by
   * default, or around `rotateAround` if given. `rotateAround` is in the
   * model's own local frame, so it spins about that model axis no matter
   * how the user has dragged the view.
   *
   * @param {number} deltaTime     - seconds since last frame
   * @param {number} speed         - radians per second
   * @param {number[]} [rotateAround] - optional [x, y, z] model-local axis
   */
  const applyAutoRotation = useCallback((deltaTime, speed, rotateAround) => {
    const angle = speed * deltaTime
    if (rotateAround) {
      const localRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(...rotateAround).normalize(),
        angle
      )
      // Post-multiply: rotate in the model's local space
      quaternionRef.current.multiply(localRotation)
      return
    }
    const yRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      angle
    )
    // Pre-multiply: rotate in world space
    quaternionRef.current.premultiply(yRotation)
  }, [])

  /**
   * applyPointerDelta
   * Converts a 2D pointer delta (dx, dy in pixels) into a rotation
   * using an arcball model. The rotation axis is perpendicular to the
   * drag direction in screen space, mapped to world space.
   *
   * @param {number} dx         - pointer X delta in pixels
   * @param {number} dy         - pointer Y delta in pixels
   * @param {number} sensitivity - radians per pixel (default 0.005)
   */
  const applyPointerDelta = useCallback((dx, dy, sensitivity = 0.005) => {
    const angle = Math.sqrt(dx * dx + dy * dy) * sensitivity
    if (angle === 0) return

    // Axis is perpendicular to drag direction, in world XY plane
    const axis = new THREE.Vector3(dy, dx, 0).normalize()
    const dragRotation = new THREE.Quaternion().setFromAxisAngle(axis, angle)
    quaternionRef.current.premultiply(dragRotation)
  }, [])

  /**
   * reset
   * Returns the quaternion to the initial euler configuration.
   */
  const reset = useCallback(() => {
    const euler = new THREE.Euler(...initialEuler, 'XYZ')
    quaternionRef.current.setFromEuler(euler)
  }, [initialEuler])

  return { quaternionRef, applyAutoRotation, applyPointerDelta, reset }
}
