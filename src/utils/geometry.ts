import * as THREE from "three";

// Cached plane geometries keyed by "WxH" to avoid recreating per face.
const planeCache = new Map<string, THREE.PlaneGeometry>();

export function getPlaneGeometry(w: number, h: number): THREE.PlaneGeometry {
  const key = `${w}x${h}`;
  let geo = planeCache.get(key);
  if (!geo) {
    geo = new THREE.PlaneGeometry(w, h);
    planeCache.set(key, geo);
  }
  return geo;
}

// Cached edge geometries derived from plane geometries.
const edgesCache = new Map<string, THREE.EdgesGeometry>();
export function getEdgesGeometry(w: number, h: number): THREE.EdgesGeometry {
  const key = `${w}x${h}`;
  let geo = edgesCache.get(key);
  if (!geo) {
    geo = new THREE.EdgesGeometry(getPlaneGeometry(w, h));
    edgesCache.set(key, geo);
  }
  return geo;
}

// Smoothstep easing — nicer than linear, no bounce.
export function easeInOut(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

// Map global progress 0..1 to face-local progress using its [startAt, endAt] window.
export function faceProgress(
  globalT: number,
  startAt: number,
  endAt: number,
): number {
  if (endAt <= startAt) return globalT >= startAt ? 1 : 0;
  return easeInOut((globalT - startAt) / (endAt - startAt));
}
