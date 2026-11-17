"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vH;
  varying float vFade;

  // ola: suma de senos + una cresta central que "respira"
  float wave(vec2 p, float t) {
    float h = sin(p.x * 0.55 + t * 0.6) * 0.55
            + sin(p.x * 1.3 - p.y * 0.8 + t * 0.9) * 0.28
            + sin(p.y * 1.7 + t * 0.45) * 0.18;
    float ridge = exp(-pow(p.y * 0.55, 2.0)) * (1.2 + sin(p.x * 0.35 - t * 0.7) * 0.6);
    return h + ridge;
  }

  void main() {
    vec3 pos = position;
    float h = wave(pos.xz, uTime);
    pos.y += h + sin(uTime * 1.5 + aSeed * 6.2831) * 0.04;
    vH = h;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFade = smoothstep(-34.0, -6.0, mv.z) * smoothstep(0.0, -3.0, mv.z);
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (1.0 / -mv.z) * (1.0 + max(h, 0.0) * 0.35);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uLime;
  varying float vH;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    // valles oscuros -> lima -> crestas casi blancas
    vec3 col = mix(uLime * 0.35, uLime, smoothstep(-0.6, 0.9, vH));
    col = mix(col, vec3(1.0), smoothstep(1.3, 2.4, vH));
    gl_FragColor = vec4(col, glow * vFade * (0.35 + smoothstep(-0.8, 1.6, vH) * 0.65));
  }
`;

function Wave({ still, dense }: { still: boolean; dense: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const cols = dense ? 240 : 150, rows = dense ? 90 : 60;
    const pos = new Float32Array(cols * rows * 3);
    const seed = new Float32Array(cols * rows);
    let s = 9;
    const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        pos[k * 3] = (i / (cols - 1) - 0.5) * 34;
        pos[k * 3 + 1] = 0;
        pos[k * 3 + 2] = (j / (rows - 1) - 0.5) * 14;
        seed[k] = rand();
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [dense]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 4.0 }, uSize: { value: dense ? 46 : 40 }, uLime: { value: new THREE.Color("#C5F34A") } }),
    [dense]
  );
  useFrame((_, dt) => {
    if (!still && mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <points geometry={geo} position={[0, -1.6, -8]}>
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function ParticleWave({ still = false, mobile = false }: { still?: boolean; mobile?: boolean }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ fov: 42, position: [0, 1.4, 6], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={still ? "demand" : "always"}
      onCreated={({ camera }) => camera.lookAt(0, -0.6, -8)}
    >
      <Wave still={still} dense={!mobile} />
    </Canvas>
  );
}
