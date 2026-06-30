// Box dimensions & per-face configuration for the folding animation.
// Each face is a Group with a pivot at its hinge (crease) and a child Plane
// offset so the plane lies flat in the XY plane when rotation = 0.

export const BOX = {
  width: 2, // X
  depth: 2, // Z (when folded) — also the front/back panel "height-when-flat"
  height: 1.5, // Y (when folded) — fold target along vertical sides
} as const;

export type FaceName = "bottom" | "front" | "back" | "left" | "right" | "top";

export interface FaceConfig {
  name: FaceName;
  color: string;
  // Plane size [w, h]
  size: [number, number];
  // Hinge pivot world position when flat (z = 0 plane).
  pivot: [number, number, number];
  // Offset of the plane center from the pivot (in the plane's local frame).
  offset: [number, number, number];
  // Axis to rotate around: 'x' or 'y'
  axis: "x" | "y";
  // Target rotation in radians at fold progress = 1
  targetRotation: number;
  // 0..1 — when (within total tween) this face starts folding
  startAt: number;
  // 0..1 — when this face finishes folding
  endAt: number;
}

const { width: W, depth: D, height: H } = BOX;

// The bottom sits centered on origin in the XY plane (flat layout).
// Side panels hinge along the bottom's edges. The top hinges along the back panel.
export const FACES: FaceConfig[] = [
  {
    name: "bottom",
    color: "#9ca3af",
    size: [W, D],
    pivot: [0, 0, 0],
    offset: [0, 0, 0],
    axis: "x",
    targetRotation: 0,
    startAt: 0,
    endAt: 0,
  },
  {
    name: "front",
    color: "#3b82f6",
    size: [W, H],
    // Hinge along the bottom's front edge (y = -D/2)
    pivot: [0, -D / 2, 0],
    offset: [0, -H / 2, 0],
    axis: "x",
    targetRotation: -Math.PI / 2,
    startAt: 0.0,
    endAt: 0.6,
  },
  {
    name: "back",
    color: "#22c55e",
    size: [W, H],
    pivot: [0, D / 2, 0],
    offset: [0, H / 2, 0],
    axis: "x",
    targetRotation: Math.PI / 2,
    startAt: 0.0,
    endAt: 0.6,
  },
  {
    name: "left",
    color: "#f97316",
    size: [H, D],
    pivot: [-W / 2, 0, 0],
    offset: [-H / 2, 0, 0],
    axis: "y",
    targetRotation: -Math.PI / 2,
    startAt: 0.15,
    endAt: 0.75,
  },
  {
    name: "right",
    color: "#a855f7",
    size: [H, D],
    pivot: [W / 2, 0, 0],
    offset: [H / 2, 0, 0],
    axis: "y",
    targetRotation: Math.PI / 2,
    startAt: 0.15,
    endAt: 0.75,
  },
  {
    name: "top",
    color: "#eab308",
    size: [W, D],
    // Lid is attached to the back panel's far edge in the flat layout.
    pivot: [0, D / 2, 0],
    offset: [0, D / 2, 0], // sits beyond back panel when flat
    axis: "x",
    targetRotation: Math.PI, // folds all the way over to close lid
    startAt: 0.7,
    endAt: 1.0,
  },
];

export const ANIMATION_DURATION_MS = 2000;
