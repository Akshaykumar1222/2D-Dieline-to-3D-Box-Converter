import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { FACES, BOX, type FaceConfig } from "@/utils/constants";
import {
  getPlaneGeometry,
  getEdgesGeometry,
  faceProgress,
} from "@/utils/geometry";
import { useAnimation } from "@/hooks/useAnimation";

interface FaceProps {
  face: FaceConfig;
  texture: THREE.Texture | null;
}

/**
 * One foldable panel. The outer Group is positioned at the hinge (crease)
 * and rotated to fold. The inner mesh is offset so the plane lies flat
 * (relative to its hinge) at rotation = 0.
 */
function Face({ face, texture }: FaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const planeGeo = useMemo(
    () => getPlaneGeometry(face.size[0], face.size[1]),
    [face.size],
  );
  const edgeGeo = useMemo(
    () => getEdgesGeometry(face.size[0], face.size[1]),
    [face.size],
  );

  // Animate rotation each frame based on global fold progress.
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const p = useAnimation.getState().progress;
    const local = faceProgress(p, face.startAt, face.endAt);
    const rot = face.targetRotation * local;
    if (face.axis === "x") g.rotation.x = rot;
    else g.rotation.y = rot;
  });

  // Apply / refresh texture when it changes.
  useEffect(() => {
    if (matRef.current) {
      matRef.current.map = texture;
      matRef.current.needsUpdate = true;
    }
  }, [texture]);

  return (
    <group
      ref={groupRef}
      position={face.pivot}
    >
      <mesh
        position={face.offset}
        castShadow
        receiveShadow
        geometry={planeGeo}
      >
        <meshStandardMaterial
          ref={matRef}
          color={face.color}
          side={THREE.DoubleSide}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <lineSegments position={face.offset} geometry={edgeGeo}>
        <lineBasicMaterial color="#111111" />
      </lineSegments>
    </group>
  );
}

interface BoxBuilderProps {
  textureUrl: string | null;
}

export function BoxBuilder({ textureUrl }: BoxBuilderProps) {
  // Load texture imperatively so it can be null when nothing is uploaded.
  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const t = loader.load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  // Dispose texture on unmount / change.
  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  // Lift bottom slightly off the ground so the shadow is visible.
  return (
    <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {FACES.map((f) => (
        <Face key={f.name} face={f} texture={texture} />
      ))}
    </group>
  );
}

// Useful for consumers that want box dims (e.g. camera framing).
export { BOX };
