'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';

// ... other imports stay the same

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

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4);

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show image after textures are loaded
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

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

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    // Smooth fade in
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.05
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroFuturistic = () => {

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg" id="manifesto">
      <div className="absolute inset-0 z-10 opacity-60 mix-blend-screen pointer-events-none">
        <Canvas
            flat
            gl={async (props) => {
            const renderer = new THREE.WebGPURenderer(props as any);
            await renderer.init();
            return renderer;
            }}
        >
            <Suspense fallback={null}>
                <PostProcessing fullScreenEffect={true} strength={0.6} />
                <Scene />
            </Suspense>
        </Canvas>
      </div>

      <div className="shell relative z-20 min-h-[calc(100vh-60px)] flex flex-col justify-between pt-10 pb-6 pointer-events-none">
        <div className="flex justify-between font-mono text-[11px] text-ink-dim uppercase tracking-widest mb-10">
          <span className="hidden sm:inline">[ BRAND OPERATING SYSTEM ]</span>
          <span className="hidden sm:inline">INDEX / 01 — 07</span>
          <span>REV. 2026.04</span>
          <span>NICOLÁS · DESIGN+ENG</span>
        </div>

        <div className="mt-auto">
          <div className="text-[clamp(50px,15vw,300px)] font-bold leading-[0.82] tracking-[-0.055em] relative">
            NCLS<span className="text-acid">.</span>DEV
            <span className="inline-block w-[0.42em] h-[0.82em] bg-acid ml-[0.04em] align-[-0.12em] animate-[blink_1s_steps(2)_infinite]"></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-8 lg:gap-12 mt-12 pt-8 border-t border-line items-start pointer-events-auto bg-bg/20 backdrop-blur-sm p-4 -ml-4">
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">// Thesis</h3>
              <p className="text-[18px] md:text-[22px] leading-[1.35] font-medium tracking-[-0.015em] max-w-[28ch]">
                Diseño lo que construyo. <span className="acid-hl">Construyo lo que diseño.</span> La creatividad es una función técnica.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">// Stack</h3>
              <div className="text-[11px] font-mono leading-[1.6]">
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1">Design</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1">Systems</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1">Automation</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim">Brand</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim">UI/UX</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim">Full-Stack</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim">AI</span>
              </div>
            </div>
            <div>
              <h3 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">// Status</h3>
              <p className="font-mono text-[12px] text-ink-dim leading-[1.7]">
                ACEPTANDO PROYECTOS<br/>
                → Q3 2026<br/>
                <span className="text-acid">● LIBRE 3 SLOTS</span><br/>
                RESPUESTA &lt; 24h
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-line py-4 -mx-5 md:-mx-10 mt-6 text-[clamp(22px,3vw,44px)] font-bold tracking-[-0.02em] whitespace-nowrap pointer-events-auto bg-bg/60 backdrop-blur-md">
          <div className="ticker-track">
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>AUTOMATIZACIÓN CON INTENCIÓN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>AUTOMATIZACIÓN CON INTENCIÓN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;
