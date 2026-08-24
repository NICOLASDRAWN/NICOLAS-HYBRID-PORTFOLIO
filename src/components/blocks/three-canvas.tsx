'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import type { Mesh as ThreeMesh } from 'three';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
extend(THREE as any);

const PostProcessing = ({
  strength = 0.85,
  threshold = 0.8,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.45, threshold);

    const uScanProgress = uniform(0);
    // eslint-disable-next-line react-hooks/refs -- R3F pattern: store uniform ref for useFrame
    progressRef.current = uScanProgress;

    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.06);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    
    // Cinematic Acid Lime (#C6FF3D) & Platinum glow instead of red
    const acidColor = vec3(0.776, 1.0, 0.239);
    const glowOverlay = acidColor.mul(oneMinus(scanLine)).mul(0.38);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, glowOverlay),
      fullScreenEffect ? smoothstep(0.85, 1.0, oneMinus(scanLine)) : 1.0
    );

    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.4) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const visible = rawMap && depthMap;

  const meshRef = useRef<ThreeMesh>(null);
  const pointerSmooth = useRef(new THREE.Vector2(0, 0));

  /* eslint-disable react-hooks/immutability */
  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.02;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap.r;

    const flow = oneMinus(smoothstep(0, 0.025, abs(depth.sub(uProgress))));

    // Acid Lime glow on the flowing waveform
    const acidFlow = vec3(1.2, 1.6, 0.4);
    const mask = dot.mul(flow).mul(acidFlow).mul(5.0);

    const final = blendScreen(tMap, mask);

    const mat = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material: mat,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  const targetOpacity = visible ? 1 : 0;

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    // Smooth breathing waveform
    uniforms.uProgress.value = (Math.sin(t * 0.35) * 0.5 + 0.5);

    // Smooth cinematic mouse damping (inertia)
    pointerSmooth.current.x = THREE.MathUtils.lerp(pointerSmooth.current.x, pointer.x, 0.04);
    pointerSmooth.current.y = THREE.MathUtils.lerp(pointerSmooth.current.y, pointer.y, 0.04);
    uniforms.uPointer.value.copy(pointerSmooth.current);

    // Cinematic 3D mesh tilt & subtle camera breathing
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, pointerSmooth.current.y * 0.12, 0.04);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, pointerSmooth.current.x * 0.15, 0.04);
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.06;
      meshRef.current.position.x = Math.cos(t * 0.3) * 0.04;
    }

    const mat = meshRef.current?.material as THREE.MeshBasicNodeMaterial | undefined;
    if (mat && 'opacity' in mat) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
    }
  });

  const scaleFactor = 0.55;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material} position={[0.2, 0, 0]}>
      <planeGeometry />
    </mesh>
  );
};

export default function ThreeCanvas() {
  return (
    <Canvas
      flat
      gl={async (props) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderer = new THREE.WebGPURenderer(props as any);
        await renderer.init();
        return renderer;
      }}
    >
      <Suspense fallback={null}>
        <PostProcessing fullScreenEffect={true} strength={0.8} />
        <Scene />
      </Suspense>
    </Canvas>
  );
}
