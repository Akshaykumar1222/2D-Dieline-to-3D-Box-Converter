import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { BoxBuilder } from "./BoxBuilder";
import { AnimationController } from "./AnimationController";
import { useAnimation } from "@/hooks/useAnimation";

interface ThreeSceneProps {
  textureUrl: string | null;
}

/**
 * Three.js canvas with lighting rig, ground, grid, and orbit controls.
 * The canvas itself is transparent so the page background shows through.
 */
export function ThreeScene({ textureUrl }: ThreeSceneProps) {
  const controlsRef = useRef<any>(null);
  const progress = useAnimation((s) => s.progress);
  // Auto-rotate once the box is fully folded (bonus feature).
  const autoRotate = progress >= 0.999;

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <PerspectiveCamera makeDefault position={[4, 3.5, 5]} fov={45} />

      {/* Lighting rig */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#ffffff", "#444466", 0.5]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Ground: shadow-receiver + grid */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
      <gridHelper args={[20, 20, "#94a3b8", "#cbd5e1"]} position={[0, 0.001, 0]} />

      <Suspense fallback={null}>
        <BoxBuilder textureUrl={textureUrl} />
      </Suspense>

      <AnimationController />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={1.2}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
}
