import { create } from "zustand";
import { ANIMATION_DURATION_MS } from "@/utils/constants";

interface AnimationState {
  // Current fold progress (0 = flat, 1 = closed)
  progress: number;
  // Whether requestAnimationFrame loop is currently driving progress
  playing: boolean;
  // Direction of the active tween: 1 = folding, -1 = unfolding
  direction: 1 | -1;
  // Multiplier for animation speed (1 = base 2s duration)
  speed: number;
  setProgress: (v: number) => void;
  setSpeed: (v: number) => void;
  fold: () => void;
  reset: () => void;
  replay: () => void;
}

export const useAnimation = create<AnimationState>((set, get) => ({
  progress: 0,
  playing: false,
  direction: 1,
  speed: 1,
  setProgress: (v) => set({ progress: Math.min(1, Math.max(0, v)), playing: false }),
  setSpeed: (v) => set({ speed: Math.max(0.1, v) }),
  fold: () => set({ playing: true, direction: 1 }),
  reset: () =>
    set({ progress: 0, playing: false, direction: 1 }),
  replay: () => {
    set({ progress: 0, playing: false, direction: 1 });
    // Kick on next tick so the scene picks up the reset frame first.
    setTimeout(() => get().fold(), 30);
  },
}));

export const BASE_DURATION_MS = ANIMATION_DURATION_MS;
