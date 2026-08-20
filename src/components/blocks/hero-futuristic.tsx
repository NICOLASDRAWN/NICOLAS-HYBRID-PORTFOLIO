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

  // Cinematic scale factor for expansive landscape feel
  const scaleFactor = 0.55;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material} position={[0.2, 0, 0]}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroFuturistic = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg" id="manifesto" role="banner">
      {/* Cinematic Vignette & Radial Glow Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 55% 45%, rgba(198, 255, 61, 0.06) 0%, transparent 65%),
            radial-gradient(ellipse 95% 85% at 50% 50%, transparent 35%, rgba(10, 10, 10, 0.75) 70%, #0A0A0A 100%)
          `
        }}
        aria-hidden="true"
      />

      {/* Cinematic Horizontal Anamorphic Lens Streak */}
      <div 
        className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-acid/20 to-transparent pointer-events-none z-10 opacity-70 blur-[1px]" 
        aria-hidden="true"
      />

      {/* 3D WebGPU Canvas with Cinematic Shaders */}
      <div className="absolute inset-0 z-0 opacity-75 mix-blend-screen pointer-events-none" aria-hidden="true">
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
      </div>

      {/* HUD Telemetry Frame (Cinematic Viewfinder Overlay) */}
      <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-10 flex flex-col justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.2em] uppercase select-none opacity-60" aria-hidden="true">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse shadow-[0_0_8px_var(--color-acid)]"></span>
            <span className="text-acid/80">REC ● [00:26:04:18]</span>
            <span className="hidden md:inline text-ink-dimmer">// FPS: 60.0</span>
          </div>
          <div className="text-right">
            <span>ANAMORPHIC · 2.39:1</span>
            <span className="hidden sm:inline ml-3 text-acid/60">FOV: 85°</span>
          </div>
        </div>
        <div className="flex justify-between items-end pb-12 md:pb-6">
          <div className="hidden sm:block">
            <span>OPTICAL DEPTH: ACTIVE</span><br/>
            <span className="text-acid/60">NODE: BOG_LATAM_01</span>
          </div>
          <div className="text-right">
            <span>[ + ] CROSSHAIR CENTER</span><br/>
            <span className="text-ink-dim">COLOR_TEMP: 5600K</span>
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="shell relative z-20 min-h-[calc(100vh-60px)] flex flex-col justify-between pt-10 pb-6 pointer-events-none">
        <div className="flex justify-between font-mono text-[11px] text-ink-dim uppercase tracking-widest mb-10" aria-hidden="true">
          <span className="hidden sm:inline">[ BRAND OPERATING SYSTEM ]</span>
          <span className="hidden sm:inline">INDEX / 01 — 07</span>
          <span>REV. 2026.04</span>
          <span>NICOLÁS · DISEÑO+ENG</span>
        </div>

        <div className="mt-auto">
          <div className="text-[clamp(50px,15vw,300px)] font-bold leading-[0.82] tracking-[-0.055em] relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            NCLS<span className="text-acid">.</span>DEV
            <span className="inline-block w-[0.42em] h-[0.82em] bg-acid ml-[0.04em] align-[-0.12em] animate-[blink_1s_steps(2)_infinite]"></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-8 lg:gap-12 mt-12 pt-8 border-t border-line items-start pointer-events-auto bg-bg/40 backdrop-blur-md p-6 -ml-4 border border-line/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Tesis`}</h3>
              <p className="text-[18px] md:text-[22px] leading-[1.35] font-medium tracking-[-0.015em] max-w-[28ch] text-ink">
                Diseño lo que construyo. <span className="acid-hl">Construyo lo que diseño.</span> La creatividad es una función técnica.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Stack`}</h3>
              <div className="text-[11px] font-mono leading-[1.6]">
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Diseño</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Desarrollo</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Automatización</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Branding</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">UI/UX</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Full-Stack</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">IA</span>
              </div>
            </div>
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Estado`}</h3>
              <p className="font-mono text-[12px] text-ink-dim leading-[1.7]">
                ACEPTANDO PROYECTOS<br/>
                → Q3 2026<br/>
                <span className="text-acid font-medium acid-pulse">● LIBRE 3 SLOTS</span><br/>
                RESPUESTA &lt; 24h
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-line py-4 -mx-5 md:-mx-10 mt-6 text-[clamp(22px,3vw,44px)] font-bold tracking-[-0.02em] whitespace-nowrap pointer-events-auto bg-bg/75 backdrop-blur-md" aria-hidden="true">
          <div className="ticker-track">
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>BRAND IDENTITY + CODE</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>BRAND IDENTITY + CODE</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;

