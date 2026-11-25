import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import useQuaternion from '../../hooks/useQuaternion.js'
import usePinchZoom from '../../hooks/usePinchZoom.js'
import ProgressionSlider from './ProgressionSlider.jsx'
import AlphaSlider from './AlphaSlider.jsx'
import CompactProgression from './CompactProgression.jsx'
import styles from './GLTFViewer.module.css'

// ─── Look: matched to STLViewer ───────────────────────────────────────────────
// Same "legacy" rendering as STLViewer (three r128 style: no color
// management, linear output, light intensities × PI) and the same four
// lights, so a .glb sits next to an .stl without looking out of place. The
// background is the same CSS gradient behind a transparent canvas.
THREE.ColorManagement.enabled = false
const PI = Math.PI

// Used for every part when config.colorMode is 'uniform' — the STL look.
const UNIFORM_COLOR = 0xbcccdc

// With no environment map, fully metallic CAD materials render almost black;
// cap metalness at what STLViewer uses so parts stay readable.
const MAX_METALNESS = 0.75

// STLViewer's lights are tuned for its metallic finish, which soaks up most
// of the light. Matte CAD colours under the same lights wash out to white,
// so in 'model' colour mode the same lights (same directions and tints) are
// scaled down to keep each part's colour readable.
const MODEL_COLOR_LIGHT_SCALE = 0.7

// ─── Behaviour: matched to STLViewer ──────────────────────────────────────────
const DEFAULT_EULER = [0.28, 0, 0]   // starting tilt toward the viewer (radians)
const DEFAULT_SPEED = 0.24           // auto-rotation, radians per second
const AUTO_ROTATE_RESUME_MS = 3200
const DRAG_SPEED = 0.007             // radians per pixel dragged
const UPRIGHT_AXIS = [0, 1, 0]       // model's own up axis, for tall models

// Models are normalized to a ~1-unit bounding radius; this distance (at
// config.zoom 1) fits them comfortably in frame.
const BASE_CAMERA_DISTANCE = 3.5
const ZOOM_MIN = 1.6
const ZOOM_MAX = 8

// Below this rendered width the progression slider hides its step names.
const COMPACT_WIDTH = 360

// Draco / KTX2 decoders, copied from three's own examples/jsm/libs into
// public/vendor. Draco is fetched as soon as a viewer starts (see
// preload() below); KTX2 only if a model actually uses it.
const DRACO_DECODER_PATH = `${import.meta.env.BASE_URL}vendor/draco/`
const KTX2_TRANSCODER_PATH = `${import.meta.env.BASE_URL}vendor/basis/`

// ─── Helpers ──────────────────────────────────────────────────────────────────

const materialsOf = (mesh) => (Array.isArray(mesh.material) ? mesh.material : [mesh.material])

// Converts a GLTF material (authored for sRGB output) to the legacy linear
// pipeline above, so its colors display exactly as exported from CAD.
function adaptMaterial(mat, needsTransparency) {
  mat.color?.convertLinearToSRGB()
  mat.emissive?.convertLinearToSRGB()
  ;['map', 'emissiveMap'].forEach((key) => {
    if (mat[key]) mat[key].colorSpace = THREE.NoColorSpace
  })
  if (mat.metalness !== undefined) mat.metalness = Math.min(mat.metalness, MAX_METALNESS)
  mat.transparent = needsTransparency
  mat.depthWrite = true
  mat.side = THREE.DoubleSide
  mat.needsUpdate = true
}

/** Projects an object-local 3D point to canvas pixels; null if behind the camera. */
function projectToScreen(point3d, object, camera, w, h) {
  const projected = point3d.clone().applyMatrix4(object.matrixWorld).project(camera)
  if (projected.z > 1) return null
  return { x: (projected.x * 0.5 + 0.5) * w, y: (-projected.y * 0.5 + 0.5) * h, z: projected.z }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * GLTFViewer
 *
 * Interactive view of .glb / .gltf models, keeping each part's own colors
 * from the CAD export (so different parts are easy to tell apart). Same
 * look and controls as STLViewer: slowly auto-rotates, drag to rotate,
 * scroll / pinch to zoom in the full-size view. Fills its parent box.
 * Ported from the GLTF viewer on thomasfieguth.github.io.
 *
 * Three modes:
 *   'basic'        one model                              — `model`
 *   'progression'  steps through stages of a build; each step shows its own
 *                  set of model files                     — `steps`
 *   'internal'     several models stacked; a slider fades the outer ones to
 *                  their `opacity` to reveal what's inside — `models`
 *
 * Props:
 *   mode          'basic' | 'progression' | 'internal'   (default 'basic')
 *   model         string                                 (basic)
 *   steps         { label?: string, models: string[] }[] (progression)
 *   models        { path, label, opacity }[]             (internal)
 *   annotations   { label, headPosition: {x,y,z}, textOffset: {x,y} }[]
 *                 — arrows with labels pinned to points on the model
 *   config        {
 *     colorMode     'model' (default: the file's own colors) | 'uniform'
 *                   (every part the STL viewer's metallic grey, or `color`)
 *     color         hex for 'uniform'
 *     upAxis        'z' (default — Onshape exports are Z-up) | 'y' (glTF's own
 *                   convention, for files that already come in upright)
 *     initialEuler  [x, y, z] starting rotation in radians (default slight tilt)
 *     rotationSpeed radians per second (default 0.24; 0 = no auto-rotation)
 *     rotateAround  [x, y, z] auto-rotation axis in the model's own frame;
 *                   tall models spin about their own up axis automatically
 *     zoom          starting zoom, >1 = closer (default 1)
 *     waitMs        ms each progression/internal step is held (default 2500)
 *     fadeMs        ms per transition (default 600)
 *     compactText   progression only: dots + step name instead of a slider
 *   }
 *   tile          sits inside a page grid: no wheel zoom, and on touch screens
 *                 only sideways drags rotate so vertical swipes scroll the page
 *   hideControls  hide the docked slider (default false)
 *   initialStepIndex / initialInternalPos  start at this step / position
 *   onOpen        (({ stepIndex, internalPos }) => void)? — shows an "open
 *                 full size" button; called with the current step/position
 *   onError       (() => void)? — called if the model can't be loaded (e.g.
 *                 to show a fallback image instead); otherwise an error shows
 *   hint          small label overlaid at the bottom of the canvas
 */
export default function GLTFViewer({
  mode = 'basic',
  model,
  steps = [],
  models = [],
  annotations = [],
  config = {},
  tile = false,
  hideControls = false,
  initialStepIndex,
  initialInternalPos,
  onOpen,
  onError,
  hint,
}) {
  const {
    colorMode = 'model',
    color = UNIFORM_COLOR,
    initialEuler = DEFAULT_EULER,
    rotationSpeed = DEFAULT_SPEED,
    rotateAround,
    zoom = 1,
    waitMs = 2500,
    fadeMs = 600,
    compactText = false,
    upAxis = 'z',
  } = config

  // ── Refs ──────────────────────────────────────────────────────────────
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const groupRef = useRef(null)
  const meshesRef = useRef([])           // every mesh from every model file
  const scenesRef = useRef([])           // gltf.scene roots, for disposal
  const spinAxisRef = useRef(rotateAround)
  const viewShiftRef = useRef(null)      // initial centering shift (NDC)
  const sizeRef = useRef(new THREE.Vector2())
  const draggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const autoRotateRef = useRef(true)
  const resumeTimerRef = useRef(null)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  // ── State ─────────────────────────────────────────────────────────────
  const [inView, setInView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [stepIndex, setStepIndex] = useState(initialStepIndex ?? 0)
  const [internalPos, setInternalPos] = useState(initialInternalPos ?? 0)
  const [interacting, setInteracting] = useState(false)
  const [narrow, setNarrow] = useState(false)

  const { quaternionRef, applyAutoRotation, applyPointerDelta } = useQuaternion(initialEuler)

  // Every model file this viewer needs, each loaded once.
  const modelList = (() => {
    if (mode === 'progression') {
      const seen = new Set()
      return steps.flatMap((step) => step.models)
        .filter((path) => !seen.has(path) && seen.add(path))
        .map((path) => ({ path, opacity: 1 }))
    }
    if (mode === 'internal') return models.map((m) => ({ path: m.path, opacity: m.opacity }))
    return [{ path: model, opacity: 1 }]
  })()

  // ── Visibility / opacity per mode ─────────────────────────────────────
  const applyStep = useCallback((meshes, idx) => {
    if (mode !== 'progression') {
      meshes.forEach((m) => { m.visible = true })
      return
    }
    const visible = new Set(steps[idx]?.models ?? [])
    meshes.forEach((m) => { m.visible = visible.has(m.userData.path) })
  }, [mode, steps])

  // Internal mode: files before the slider position are faded to their
  // target opacity; the file at the position is partway there.
  const applyInternal = useCallback((meshes, pos) => {
    const count = models.length
    const floor = Math.floor(Math.min(pos, count - 1))
    const frac = pos - floor
    meshes.forEach((m) => {
      const i = m.userData.modelIndex
      const target = m.userData.baseOpacity
      const opacity = i < floor ? target : i === floor ? 1 - frac * (1 - target) : 1
      materialsOf(m).forEach((mat) => { mat.opacity = opacity })
    })
  }, [models.length])

  // ── Lazy init: only start WebGL once scrolled near the viewer ─────────
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true)
        observer.disconnect()
      }
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Three.js setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current
    let disposed = false

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100)
    camera.position.set(0, 0, BASE_CAMERA_DISTANCE / zoom)
    cameraRef.current = camera

    // Same lights as STLViewer (dimmed for the model's own colours, see above).
    const L = colorMode === 'uniform' ? PI : PI * MODEL_COLOR_LIGHT_SCALE
    scene.add(new THREE.AmbientLight(0x334466, 0.7 * L))
    const key = new THREE.DirectionalLight(0xffffff, 1.3 * L)
    key.position.set(5, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x00d4ff, 0.5 * L)
    fill.position.set(-5, 2, -4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0x00a896, 0.3 * L)
    rim.position.set(0, -4, -5)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)
    groupRef.current = group

    // Start fetching the Draco decoder now, alongside the model, rather than
    // only after the model arrives — our models are all Draco-compressed
    // (see the gltf.report steps), so this saves a round trip.
    const dracoLoader = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH).preload()
    const ktx2Loader = new KTX2Loader().setTranscoderPath(KTX2_TRANSCODER_PATH).detectSupport(renderer)
    const loader = new GLTFLoader().setDRACOLoader(dracoLoader).setKTX2Loader(ktx2Loader)

    Promise.all(modelList.map(({ path, opacity }, modelIndex) => new Promise((resolve, reject) => {
      loader.load(path, (gltf) => resolve({ gltf, path, opacity, modelIndex }), undefined, reject)
    })))
      .then((loaded) => {
        if (disposed) return
        // One shared transform for every file, so stacked models stay aligned.
        const box = new THREE.Box3()
        loaded.forEach(({ gltf }) => {
          // Onshape (like most CAD) exports with Z up; the viewer's up is Y.
          if (upAxis === 'z') gltf.scene.rotation.x = -PI / 2
          gltf.scene.updateMatrixWorld(true)
          box.union(new THREE.Box3().setFromObject(gltf.scene))
        })
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const radius = size.length() / 2
        const scale = radius > 0 ? 1 / radius : 1
        // Tall models (e.g. a sculpture) spin about their own vertical axis.
        if (!rotateAround && size.y >= Math.max(size.x, size.z)) spinAxisRef.current = UPRIGHT_AXIS

        const meshes = []
        // CAD exports share one material between many parts; adapt each once
        // (converting a colour twice would wash it out).
        const adapted = new Set()
        loaded.forEach(({ gltf, path, opacity, modelIndex }) => {
          const wrapper = new THREE.Group()
          wrapper.position.copy(center).multiplyScalar(-scale)
          wrapper.scale.setScalar(scale)
          wrapper.add(gltf.scene)
          group.add(wrapper)
          scenesRef.current.push(gltf.scene)

          const needsTransparency = opacity < 1 || mode === 'progression'
          gltf.scene.traverse((child) => {
            if (!child.isMesh) return
            child.userData.path = path
            child.userData.baseOpacity = opacity
            child.userData.modelIndex = modelIndex
            if (colorMode === 'uniform') {
              materialsOf(child).forEach((mat) => mat.dispose())
              child.material = new THREE.MeshStandardMaterial({
                color, metalness: 0.75, roughness: 0.25,
                transparent: needsTransparency, side: THREE.DoubleSide,
              })
            } else {
              materialsOf(child).forEach((mat) => {
                if (adapted.has(mat)) return
                adapted.add(mat)
                adaptMaterial(mat, needsTransparency)
              })
            }
            meshes.push(child)
          })
        })

        meshesRef.current = meshes
        viewShiftRef.current = null
        applyStep(meshes, stepIndex)
        if (mode === 'internal') applyInternal(meshes, internalPos)
        setLoading(false)
      })
      .catch((err) => {
        if (disposed) return
        console.error('GLTFViewer: could not load model', err)
        setLoading(false)
        if (onErrorRef.current) onErrorRef.current()
        else setError(true)
      })

    // Keep the renderer and camera matched to the canvas's size.
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (overlayRef.current) {
        overlayRef.current.width = w
        overlayRef.current.height = h
      }
    })
    ro.observe(canvas)
    ro.observe(wrapRef.current)

    return () => {
      disposed = true
      ro.disconnect()
      renderer.dispose()
      dracoLoader.dispose()
      ktx2Loader.dispose()
      scenesRef.current.forEach((s) => s.traverse((child) => {
        if (!child.isMesh) return
        child.geometry.dispose()
        materialsOf(child).forEach((mat) => mat.dispose())
      }))
      scenesRef.current = []
    }
    // Set up once per viewer; later prop changes don't rebuild the scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    if (meshesRef.current.length) applyStep(meshesRef.current, stepIndex)
  }, [stepIndex, applyStep])

  useEffect(() => {
    if (mode === 'internal' && meshesRef.current.length) applyInternal(meshesRef.current, internalPos)
  }, [internalPos, mode, applyInternal])

  // Step names are hidden when the viewer is narrow (e.g. a half-width tile).
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < COMPACT_WIDTH))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Zoom (full-size view only, like STLViewer) ────────────────────────
  useEffect(() => {
    if (tile) return
    const canvas = canvasRef.current
    const onWheel = (e) => {
      e.preventDefault()
      const camera = cameraRef.current
      if (!camera) return
      camera.position.z = THREE.MathUtils.clamp(camera.position.z * Math.exp(e.deltaY * 0.001), ZOOM_MIN, ZOOM_MAX)
      pauseAutoRotate()
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [tile])

  const isPinchingRef = usePinchZoom({
    canvasRef, cameraRef, enabled: !tile, zoomMin: ZOOM_MIN, zoomMax: ZOOM_MAX,
  })

  // ── Annotations ───────────────────────────────────────────────────────
  const drawAnnotations = useCallback(() => {
    const canvas = overlayRef.current
    if (!canvas || !annotations.length) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const camera = cameraRef.current
    const group = groupRef.current
    if (!camera || !group || !meshesRef.current.length) return

    annotations.forEach(({ label, headPosition, textOffset }) => {
      const head = new THREE.Vector3(headPosition.x, headPosition.y, headPosition.z)
      const screen = projectToScreen(head, group, camera, canvas.width, canvas.height)
      if (!screen) return
      const textX = screen.x + textOffset.x
      const textY = screen.y + textOffset.y
      ctx.globalAlpha = screen.z > 0.85 ? 0.25 : 1

      // Leader line and arrowhead
      const angle = Math.atan2(screen.y - textY, screen.x - textX)
      ctx.beginPath()
      ctx.moveTo(textX, textY)
      ctx.lineTo(screen.x, screen.y)
      ctx.moveTo(screen.x, screen.y)
      ctx.lineTo(screen.x - 8 * Math.cos(angle - PI / 7), screen.y - 8 * Math.sin(angle - PI / 7))
      ctx.moveTo(screen.x, screen.y)
      ctx.lineTo(screen.x - 8 * Math.cos(angle + PI / 7), screen.y - 8 * Math.sin(angle + PI / 7))
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Label on a dark pill
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = textOffset.x >= 0 ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      const width = ctx.measureText(label).width
      const pillX = textOffset.x >= 0 ? textX - 6 : textX - width - 6
      ctx.fillStyle = 'rgba(8, 12, 20, 0.8)'
      ctx.beginPath()
      ctx.roundRect(pillX, textY - 9, width + 12, 18, 4)
      ctx.fill()
      ctx.fillStyle = '#e8edf5'
      ctx.fillText(label, textX, textY)
      ctx.globalAlpha = 1
    })
  }, [annotations])

  // ── Initial screen centering ──────────────────────────────────────────
  // Under perspective a tilted model's silhouette doesn't land in the middle
  // of the canvas. On the first frame, project the visible vertices and pick
  // a fixed 2D shift that centers it; afterwards just re-apply that shift.
  const centerOnScreen = useCallback(() => {
    const camera = cameraRef.current
    const renderer = rendererRef.current
    if (!camera || !renderer) return
    if (!viewShiftRef.current) {
      sceneRef.current.updateMatrixWorld()
      camera.updateMatrixWorld()
      const v = new THREE.Vector3()
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      meshesRef.current.forEach((mesh) => {
        const pos = mesh.geometry?.attributes?.position
        if (!mesh.visible || !pos) return
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld).project(camera)
          if (v.x < minX) minX = v.x
          if (v.x > maxX) maxX = v.x
          if (v.y < minY) minY = v.y
          if (v.y > maxY) maxY = v.y
        }
      })
      if (minX === Infinity) return
      viewShiftRef.current = { x: -(minX + maxX) / 2, y: -(minY + maxY) / 2 }
    }
    const shift = viewShiftRef.current
    const size = renderer.getSize(sizeRef.current)
    if (!size.x || !size.y) return
    camera.setViewOffset(size.x, size.y, -shift.x * size.x / 2, shift.y * size.y / 2, size.x, size.y)
  }, [])

  // ── Render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || error) return
    const clock = new THREE.Clock()
    let frame
    const loop = () => {
      frame = requestAnimationFrame(loop)
      // Capped so a long pause (e.g. a background tab) doesn't jump the model.
      const dt = Math.min(clock.getDelta(), 0.1)
      if (autoRotateRef.current && !draggingRef.current && rotationSpeed) {
        applyAutoRotation(dt, rotationSpeed, spinAxisRef.current)
      }
      groupRef.current.quaternion.copy(quaternionRef.current)
      centerOnScreen()
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      drawAnnotations()
    }
    loop()
    return () => cancelAnimationFrame(frame)
  }, [loading, error, rotationSpeed, applyAutoRotation, quaternionRef, centerOnScreen, drawAnnotations])

  useEffect(() => () => clearTimeout(resumeTimerRef.current), [])

  // ── Drag to rotate ────────────────────────────────────────────────────
  function pauseAutoRotate() {
    autoRotateRef.current = false
    clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => { autoRotateRef.current = true }, AUTO_ROTATE_RESUME_MS)
  }

  const onPointerDown = (e) => {
    draggingRef.current = true
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setInteracting(true)
    pauseAutoRotate()
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastPointerRef.current.x
    const dy = e.clientY - lastPointerRef.current.y
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    if (isPinchingRef.current) return
    // In a page grid, touch drags only turn the model sideways so vertical
    // swipes still scroll the page (touch-action: pan-y on the canvas).
    applyPointerDelta(dx, tile && e.pointerType === 'touch' ? 0 : dy, DRAG_SPEED)
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setInteracting(false)
  }

  // ── Render ────────────────────────────────────────────────────────────
  const ready = !loading && !error
  const showDock = ready && !hideControls && (mode === 'progression' || mode === 'internal')

  return (
    <div ref={wrapRef} className={styles.wrapper}>
      <div className={styles.stage}>
        <canvas
          ref={canvasRef}
          className={tile ? `${styles.canvas} ${styles.tileCanvas}` : styles.canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {annotations.length > 0 && <canvas ref={overlayRef} className={styles.overlay} />}

        {loading && (
          <div className={styles.status}>
            <div className={styles.spinner} />
            <span className={styles.statusText}>Loading model…</span>
          </div>
        )}
        {error && (
          <div className={styles.status}>
            <span className={styles.statusText}>Couldn't load this model.</span>
          </div>
        )}

        {hint && ready && <div className={styles.hint}>{hint}</div>}

        {onOpen && ready && (
          <button
            type="button"
            className={styles.expand}
            onClick={() => onOpen({ stepIndex, internalPos })}
            aria-label="Open full size"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M10 2h4v4M6 14H2v-4M14 2 9 7M2 14l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {showDock && mode === 'progression' && compactText && (
        <div className={`${styles.dock} ${styles.dockCompact}`}>
          <CompactProgression
            labels={steps.map((s) => s.label)}
            initialIndex={stepIndex}
            onStep={setStepIndex}
            paused={interacting}
            waitMs={waitMs}
            fadeMs={0}
          />
        </div>
      )}
      {showDock && mode === 'progression' && !compactText && (
        <div className={styles.dock}>
          <ProgressionSlider
            steps={steps.map((s) => ({ label: s.label }))}
            currentIndex={stepIndex}
            onChange={setStepIndex}
            paused={interacting}
            waitMs={waitMs}
            fadeMs={fadeMs}
            showLabels={!narrow}
          />
        </div>
      )}
      {showDock && mode === 'internal' && (
        <div className={styles.dock}>
          <AlphaSlider
            value={internalPos}
            onChange={setInternalPos}
            labels={models.map((m) => m.label)}
            paused={interacting}
            waitMs={waitMs}
            fadeMs={fadeMs}
            showLabels={!narrow}
          />
        </div>
      )}
    </div>
  )
}
