# 2D Dieline → 3D Box Builder

Convert a flat PNG dieline into a foldable 3D box in the browser, with smooth
per-panel hinge animation built on Three.js + React Three Fiber.

## Installation

```bash
npm install
npm run dev
```

Open the printed local URL in a browser.

## Libraries

- **React 19 + TypeScript** — UI
- **Vite** — bundler (via TanStack Start template)
- **Three.js** — 3D rendering
- **@react-three/fiber** — declarative React renderer for Three
- **@react-three/drei** — `OrbitControls`, `PerspectiveCamera` helpers
- **TailwindCSS v4** — styling
- **Zustand** — animation state store
- **shadcn/ui (Radix)** — buttons & sliders
- **lucide-react** — icons

## Architecture

```
src/
  components/
    UploadPanel.tsx        Upload + drag/drop + preview
    ThreeScene.tsx         <Canvas>, lights, ground, camera, OrbitControls
    BoxBuilder.tsx         6 face groups, animated each frame
    Controls.tsx           Fold/Reset/Replay, speed + progress sliders
    AnimationController.tsx  useFrame loop that drives fold progress
  hooks/
    useAnimation.ts        Zustand store for progress/playing/speed
    useUpload.ts           File → ObjectURL + lifecycle
  utils/
    constants.ts           Box dimensions + per-face hinge config
    geometry.ts            Cached PlaneGeometry/EdgesGeometry + easing
    parser.ts              Image decode helper
  routes/index.tsx         Page layout (header / left panel / canvas / footer)
```

## Animation explained

A single fold value `progress ∈ [0, 1]` lives in a Zustand store
(`useAnimation`). `AnimationController` is a tiny R3F component that runs in
`useFrame` and integrates `progress` over time using
`dt / BASE_DURATION_MS * speed * direction` — no jumps, smooth across any
frame rate. The base duration is 2 seconds.

Each face reads `progress` every frame and computes its **own** local progress
through a per-face `[startAt, endAt]` window with smoothstep easing. That's
what gives the realistic order: sides fold before the lid, lid closes last.

## How hinge rotations work

Every panel is built as:

```
<group position={hingePivot} rotation={fold}>   ← rotated
  <mesh position={offsetFromPivot} />            ← static
</group>
```

The plane is offset from the group's origin by half its dimension along the
fold direction, so the panel's edge sits exactly on the hinge line. Rotating
the **group** (not the mesh) makes the panel pivot around that edge — exactly
like a cardboard crease.

Hinge config (from `utils/constants.ts`):

| Face   | Pivot            | Axis | Target  | Window      |
| ------ | ---------------- | ---- | ------- | ----------- |
| Bottom | (0, 0, 0)        | —    | 0       | —           |
| Front  | (0, −D/2, 0)     | X    | −90°    | 0.0 → 0.6   |
| Back   | (0, +D/2, 0)     | X    | +90°    | 0.0 → 0.6   |
| Left   | (−W/2, 0, 0)     | Y    | −90°    | 0.15 → 0.75 |
| Right  | (+W/2, 0, 0)     | Y    | +90°    | 0.15 → 0.75 |
| Top    | (0, +D/2, 0)     | X    | +180°   | 0.7 → 1.0   |

The top lid shares the back panel's hinge in the flat layout and folds last,
all the way over (π rad) to close the box.

## Features

- Upload PNG/JPG (click or drag & drop) — used as a texture on all faces
- Fold / Reset / Replay
- Animation-speed slider (0.25× – 3×)
- Scrubbable fold-progress slider
- Orbit controls with damping
- Auto-rotate once the box is fully closed
- Fullscreen, PNG screenshot export
- Responsive layout (mobile → stacked, desktop → side-by-side)
- Grid + shadow-receiving ground plane
- Black edge lines on every panel via `EdgesGeometry`
- Memoised geometries, cleaned-up textures and object URLs
