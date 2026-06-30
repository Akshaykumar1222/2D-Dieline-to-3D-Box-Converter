import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BASE_DURATION_MS, useAnimation } from "@/hooks/useAnimation";

/**
 * Drives fold progress over time using R3F's useFrame loop.
 * Pure logic component — renders nothing.
 */
export function AnimationController() {
  const lastTime = useRef<number | null>(null);

  useFrame(() => {
    const { playing, progress, direction, speed, setProgress } =
      useAnimation.getState();

    const now = performance.now();
    if (lastTime.current == null) {
      lastTime.current = now;
      return;
    }
    const dt = now - lastTime.current;
    lastTime.current = now;

    if (!playing) return;

    const delta = (dt / BASE_DURATION_MS) * speed * direction;
    const next = Math.min(1, Math.max(0, progress + delta));

    useAnimation.setState({ progress: next });

    if (next >= 1 || next <= 0) {
      useAnimation.setState({ playing: false });
    }

    // Avoid lint warning — value used.
    void setProgress;
  });

  return null;
}
