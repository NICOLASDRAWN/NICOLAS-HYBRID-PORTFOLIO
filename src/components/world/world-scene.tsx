"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, Grid, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "./scroll-state";

const ACID = "#C5F34A";
const INK = "#FFFFFF";
const BG = "#101110";
const GAP = 34;

/** Centro de cada estación y hacia qué lado se corre el encuadre (texto al lado contrario). */
const STATIONS: { pos: [number, number, number]; side: number }[] = [
  { pos: [0, 0, 0], side: -1 },
  { pos: [9, 0, -GAP], side: 1 },
  { pos: [-5, 0, -GAP * 2], side: -1 },
  { pos: [0, 0, -GAP * 3], side: 0 },
  { pos: [7, 0, -GAP * 4], side: 1 },
  { pos: [0, 0, -GAP * 5], side: 0 },
];
/** PRNG con semilla (Park–Miller): mismas posiciones en cada render. */
function seeded(seed: number) {
  let v = seed;
  return () => ((v = (v * 16807) % 2147483647) - 1) / 2147483646;
}

const v3 = (p: [number, number, number]) => new THREE.Vector3(...p);

function buildCurves(narrow: boolean) {
  const dist = narrow ? 17 : 11.5;
  const shift = narrow ? 0 : 3.4;
  const cam: THREE.Vector3[] = [];
  const look: THREE.Vector3[] = [];
  STATIONS.forEach((s, i) => {
    const c = v3(s.pos).add(new THREE.Vector3(0, 1.4, dist));
    // en celular el titular ocupa la mitad superior del hero: bajamos el núcleo detrás del avatar
    const lift = narrow && i === 0 ? 4.5 : 0.3;
    const l = v3(s.pos).add(new THREE.Vector3(s.side * shift, lift, 0));
    cam.push(c);
    look.push(l);
    const next = STATIONS[i + 1];
    if (next) {
      // punto intermedio elevado: la cámara sobrevuela la estación que deja atrás
      const nc = v3(next.pos).add(new THREE.Vector3(0, 1.4, dist));
      cam.push(c.clone().lerp(nc, 0.5).add(new THREE.Vector3(0, 6, 0)));
      const nl = v3(next.pos).add(new THREE.Vector3(next.side * shift, 0.3, 0));
      look.push(l.clone().lerp(nl, 0.6));
    }
  });
  return {
    cam: new THREE.CatmullRomCurve3(cam, false, "centripetal"),
    look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
  };
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const size = useThree((s) => s.size);
  const narrow = size.width / size.height < 0.9;
  const curves = useMemo(() => buildCurves(narrow), [narrow]);
  const cur = useRef(scrollState.t);
  const lookAt = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());

  useFrame(({ camera }, dt) => {
    const target = scrollState.t;
    cur.current = reduced ? target : THREE.MathUtils.damp(cur.current, target, 3.2, dt);
    const u = THREE.MathUtils.clamp(cur.current / (STATIONS.length - 1), 0, 1);
    curves.cam.getPoint(u, camera.position);
    if (!reduced) {
      camera.position.x += scrollState.pointerX * 0.8;
      camera.position.y += scrollState.pointerY * 0.5;
    }
    curves.look.getPoint(u, tmp.current);
    lookAt.current.lerp(tmp.current, reduced ? 1 : 1 - Math.exp(-dt * 6));
    camera.lookAt(lookAt.current);
  });
  return null;
}

/** 0 — Núcleo: la marca como sistema vivo. */
function Core({ reduced }: { reduced: boolean }) {
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (reduced) return;
    if (shell.current) shell.current.rotation.y += dt * 0.15;
    if (ring.current) ring.current.rotation.z += dt * 0.25;
  });
  return (
    <group position={STATIONS[0].pos}>
      <Float speed={reduced ? 0 : 1.4} floatIntensity={0.6} rotationIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[2.1, 24]} />
          <MeshDistortMaterial color="#1b1c1f" roughness={0.2} metalness={0.85} distort={reduced ? 0 : 0.32} speed={1.6} />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[2.9, 1]} />
          <meshBasicMaterial color={ACID} wireframe transparent opacity={0.7} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[4.2, 0.025, 8, 160]} />
          <meshBasicMaterial color={INK} transparent opacity={0.5} />
        </mesh>
      </Float>
      <pointLight color={ACID} intensity={30} distance={14} position={[3, 2, 4]} />
    </group>
  );
}

/** 2 — Perfil: tres pilares (diseño, desarrollo, documentación). */
function Pillars() {
  const h = [4.2, 6, 3.2];
  return (
    <group position={STATIONS[2].pos}>
      {h.map((height, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.5} rotationIntensity={0.1}>
          <mesh position={[(i - 1) * 2.4, height / 2 - 2.2, (i % 2) * -1.2]}>
            <boxGeometry args={[1.3, height, 1.3]} />
            <meshStandardMaterial color={i === 1 ? "#222327" : "#18191b"} roughness={0.35} metalness={0.6} />
            <Edges color={i === 1 ? ACID : "#4a4b50"} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/** 1 — Servicios: anillos orbitales, uno por familia de herramientas. */
function Orbits({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ r: 1.6 + i * 0.75, tilt: (i - 2) * 0.35, n: 3 + i, speed: 0.5 - i * 0.07 })),
    []
  );
  useFrame((state) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((ring, i) => {
      ring.rotation.y = t * rings[i]?.speed;
    });
  });
  return (
    <group position={STATIONS[1].pos}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={ACID} emissive={ACID} emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <group ref={group}>
        {rings.map((ring, i) => (
          <group key={i} rotation={[ring.tilt, 0, ring.tilt * 0.6]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.r, 0.012, 6, 128]} />
              <meshBasicMaterial color={INK} transparent opacity={0.35} />
            </mesh>
            {Array.from({ length: ring.n }, (_, k) => {
              const a = (k / ring.n) * Math.PI * 2;
              return (
                <mesh key={k} position={[Math.cos(a) * ring.r, 0, Math.sin(a) * ring.r]}>
                  <octahedronGeometry args={[0.16]} />
                  <meshStandardMaterial color={k === 0 ? ACID : INK} roughness={0.3} metalness={0.4} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}

/** 4 — Huila: 37 municipios como pines sobre un territorio. */
function HuilaPins({ reduced }: { reduced: boolean }) {
  const pins = useMemo(() => {
    const rand = seeded(37);
    // forma alargada norte-sur, como el departamento
    return Array.from({ length: 37 }, (_, i) => ({ x: (rand() - 0.5) * 5, z: (i / 36 - 0.5) * 9 + (rand() - 0.5), h: 0.6 + rand() * 1.4, main: i % 9 === 0 }));
  }, []);
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!reduced && group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.35 + 0.6;
  });
  return (
    <group position={STATIONS[4].pos}>
      <group ref={group} rotation={[0, 0.6, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
          <circleGeometry args={[5.6, 6]} />
          <meshStandardMaterial color="#18191b" transparent opacity={0.85} />
          <Edges color={ACID} />
        </mesh>
        {pins.map((p, i) => (
          <mesh key={i} position={[p.x, -1.5 + p.h / 2, p.z]}>
            <boxGeometry args={[p.main ? 0.32 : 0.18, p.h, p.main ? 0.32 : 0.18]} />
            <meshStandardMaterial color={p.main ? ACID : INK} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** 3 — Proyectos: paneles flotantes en arco. */
function Panels() {
  const n = 8;
  return (
    <group position={STATIONS[3].pos}>
      {Array.from({ length: n }, (_, i) => {
        const a = ((i - (n - 1) / 2) / n) * Math.PI * 0.9;
        const r = 7;
        return (
          <Float key={i} speed={1.2} floatIntensity={0.8} rotationIntensity={0.15}>
            <mesh position={[Math.sin(a) * r, (i % 3) - 1, -Math.cos(a) * r + 3]} rotation={[0, -a, 0]}>
              <planeGeometry args={[2.2, 1.4]} />
              <meshStandardMaterial color={i < 3 ? "#1e2610" : "#18191b"} side={THREE.DoubleSide} transparent opacity={0.85} roughness={0.2} metalness={0.1} />
              <Edges color={i < 3 ? ACID : "#3f4045"} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

/** 5 — Contacto: un portal. */
function Portal({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.z += dt * 0.12;
  });
  return (
    <group position={STATIONS[5].pos}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[4.2, 0.09, 16, 200]} />
          <meshStandardMaterial color={ACID} emissive={ACID} emissiveIntensity={1.4} />
        </mesh>
        <mesh>
          <torusGeometry args={[5, 0.015, 8, 200]} />
          <meshBasicMaterial color={INK} transparent opacity={0.4} />
        </mesh>
      </group>
      <Sparkles count={60} scale={[8, 8, 3]} size={2.2} speed={reduced ? 0 : 0.3} color={ACID} />
      <pointLight color={ACID} intensity={40} distance={18} />
    </group>
  );
}

/** Fragmentos de píxel flotando a lo largo del recorrido (instanciados: 1 draw call). */
function PixelField({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => {
    const rand = seeded(1337);
    return Array.from({ length: count }, () => ({
      x: (rand() - 0.5) * 60, y: rand() * 24 - 4, z: 20 - rand() * (GAP * 5 + 40),
      s: 0.06 + rand() * 0.22, sp: 0.2 + rand() * 0.6, c: rand(),
    }));
  }, [count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const color = new THREE.Color();
    data.forEach((d, i) => {
      color.set(d.c < 0.55 ? ACID : d.c < 0.8 ? INK : "#3a3b3f");
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [data]);
  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y + Math.sin(t * d.sp + i) * 0.4, d.z);
      dummy.rotation.set(t * d.sp, t * d.sp * 0.7, 0);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  );
}

export default function WorldScene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      camera={{ fov: 50, near: 0.1, far: 140, position: [0, 1.4, 11.5] }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 52]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={1.2} />
      <CameraRig reduced={reduced} />
      <PixelField count={mobile ? 220 : 520} reduced={reduced} />
      <Grid
        position={[0, -3, -GAP * 2.5]}
        args={[200, 260]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1c1d1f"
        sectionSize={6}
        sectionThickness={0.9}
        sectionColor="#3c4a16"
        fadeDistance={48}
        fadeStrength={1.5}
        followCamera
        infiniteGrid
      />
      <Core reduced={reduced} />
      <Pillars />
      <Orbits reduced={reduced} />
      <HuilaPins reduced={reduced} />
      <Panels />
      <Portal reduced={reduced} />
    </Canvas>
  );
}
