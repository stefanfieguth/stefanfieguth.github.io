import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import useQuaternion from '../../hooks/useQuaternion.js'
import styles from './STLViewer.module.css'

// The original site rendered with three.js r128, whose defaults were
// "legacy" lighting and no color management. Matching those keeps the
// model's metallic look the same: hex colors used as-is, and light
// intensities scaled by PI (what r128 did internally for these lights).
THREE.ColorManagement.enabled = false
const PI = Math.PI

// Rotation is kept as a quaternion (see useQuaternion), so dragging turns
// the model about the screen's axes in any direction — over the top,
// upside down, all the way around — with no limits or gimbal lock.
const INITIAL_EULER = [0.28, 0, 0]   // starting tilt (radians), applied once
const AUTO_ROTATE_SPEED = 0.24       // radians per second, about the vertical axis
const AUTO_ROTATE_RESUME_MS = 3200
const DRAG_SPEED = 0.007             // radians per pixel dragged
const ZOOM_MIN = 2
const ZOOM_MAX = 9

// Shown if the STL file can't be loaded.
function buildSampleGear(mat, darkMat) {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.36, 64), mat))
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.36, 0.29), mat)
    t.position.set(Math.cos(a) * 1.26, 0, Math.sin(a) * 1.26)
    t.rotation.y = -a
    g.add(t)
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 16), darkMat)
    h.position.set(Math.cos(a) * 0.65, 0, Math.sin(a) * 0.65)
    g.add(h)
  }
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.42, 32), darkMat))
  const ks = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.44, 0.16), darkMat)
  ks.position.set(0.26, 0, 0)
  g.add(ks)
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.022, 8, 64), mat)
  r1.position.y = 0.18
  r1.rotation.x = Math.PI / 2
  g.add(r1)
  const r2 = r1.clone()
  r2.position.y = -0.18
  g.add(r2)
  return g
}

/**
 * STLViewer
 *
 * Interactive three.js view of one STL model: slowly auto-rotates, drag
 * (or touch-drag) to rotate, scroll to zoom. Auto-rotation pauses for a
 * few seconds after any interaction. Always lazy-loaded, so three.js never
 * lands in the main bundle.
 *
 * Props:
 *   src   string   — STL file URL
 *   hint  string?  — small label overlaid at the bottom of the canvas
 *   fill  boolean? — fill the parent box (which supplies its own border)
 *                    instead of drawing a standalone square card
 *   onError  (() => void)? — called if the file can't be loaded (missing or
 *                    not a valid STL); when given, no sample model is shown
 *   tile  boolean? — the viewer sits inside a page grid: scroll-wheel zoom
 *                    is off (so the wheel scrolls the page), and on touch
 *                    screens only sideways drags rotate, leaving vertical
 *                    swipes to scroll the page
 */
export default function STLViewer({ src, hint, fill = false, tile = false, onError }) {
  const wrapRef = useRef(null)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const canvasRef = useRef(null)
  const { quaternionRef, applyAutoRotation, applyPointerDelta } = useQuaternion(INITIAL_EULER)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    let disposed = false

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 200)
    camera.position.set(0, 0, 5)

    scene.add(new THREE.AmbientLight(0x334466, 0.7 * PI))
    const key = new THREE.DirectionalLight(0xffffff, 1.3 * PI)
    key.position.set(5, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x00d4ff, 0.5 * PI)
    fill.position.set(-5, 2, -4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0x00a896, 0.3 * PI)
    rim.position.set(0, -4, -5)
    scene.add(rim)

    const mat = new THREE.MeshStandardMaterial({ color: 0xbcccdc, metalness: 0.75, roughness: 0.25 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x080c14, metalness: 0.3, roughness: 0.7 })

    let model = null
    const failLoad = () => {
      if (onErrorRef.current) {
        onErrorRef.current()
        return
      }
      model = buildSampleGear(mat, darkMat)
      scene.add(model)
    }
    new STLLoader().load(
      src,
      (geo) => {
        if (disposed) return
        // A missing file can come back as an HTML page that parses to nothing.
        if (!geo.attributes.position?.count) {
          failLoad()
          return
        }
        geo.computeVertexNormals()
        geo.center()
        geo.computeBoundingBox()
        const size = new THREE.Vector3()
        geo.boundingBox.getSize(size)
        model = new THREE.Mesh(geo, mat)
        model.scale.setScalar(3 / Math.max(size.x, size.y, size.z))
        scene.add(model)
      },
      undefined,
      () => {
        if (disposed) return
        failLoad()
      },
    )

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // ── Interaction ──────────────────────────────────────────────────────
    let dragging = false
    let autoRotate = true
    let zoom = 5
    let px = 0
    let py = 0
    let lastTouch = null
    let autoTimer

    const pauseAutoRotate = () => {
      autoRotate = false
      clearTimeout(autoTimer)
      autoTimer = setTimeout(() => { autoRotate = true }, AUTO_ROTATE_RESUME_MS)
    }
    // Drag right/left spins about the screen's vertical axis, up/down about
    // its horizontal axis (and diagonals in between), always relative to
    // the current view, never limited.
    const rotateBy = (dx, dy) => applyPointerDelta(dx, dy, DRAG_SPEED)

    const onMouseDown = (e) => { dragging = true; px = e.clientX; py = e.clientY; pauseAutoRotate() }
    const onMouseUp = () => { dragging = false }
    const onMouseMove = (e) => {
      if (!dragging || !model) return
      rotateBy(e.clientX - px, e.clientY - py)
      px = e.clientX
      py = e.clientY
    }
    const onWheel = (e) => {
      e.preventDefault()
      zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom + e.deltaY * 0.004))
      pauseAutoRotate()
    }
    const onTouchStart = (e) => { lastTouch = e.touches[0]; pauseAutoRotate() }
    const onTouchMove = (e) => {
      if (!model || !lastTouch) return
      const t = e.touches[0]
      if (tile) {
        // Page-scroll friendly: the browser handles vertical panning
        // (touch-action: pan-y), so only turn the model sideways.
        rotateBy(t.clientX - lastTouch.clientX, 0)
      } else {
        e.preventDefault()
        rotateBy(t.clientX - lastTouch.clientX, t.clientY - lastTouch.clientY)
      }
      lastTouch = t
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    if (!tile) canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: tile })

    let frame
    const clock = new THREE.Clock()
    const loop = () => {
      frame = requestAnimationFrame(loop)
      // Capped so a long pause (e.g. a background tab) doesn't jump the model.
      const dt = Math.min(clock.getDelta(), 0.1)
      if (model) {
        if (autoRotate) applyAutoRotation(dt, AUTO_ROTATE_SPEED)
        model.quaternion.copy(quaternionRef.current)
        camera.position.set(0, 0, zoom)
        camera.lookAt(0, 0, 0)
      }
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      clearTimeout(autoTimer)
      ro.disconnect()
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      scene.traverse((obj) => obj.geometry?.dispose())
      mat.dispose()
      darkMat.dispose()
      renderer.dispose()
    }
  }, [src, tile, quaternionRef, applyAutoRotation, applyPointerDelta])

  return (
    <div ref={wrapRef} className={fill ? `${styles.wrapper} ${styles.fill}` : styles.wrapper}>
      <canvas ref={canvasRef} className={tile ? `${styles.canvas} ${styles.tileCanvas}` : styles.canvas} />
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  )
}
