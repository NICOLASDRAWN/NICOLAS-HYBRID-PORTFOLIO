/**
 * NICOLAS-HYBRID-PORTFOLIO — 3D WebGL Cyber Core
 * Real-time Three.js interactive wireframe torus & particle nebula
 * Inspired by Awwwards, Active Theory & Linear Design Engineering
 */

function initThreeHero() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for full 3D rotation
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // 1. Outer Geometric Wireframe (Icosahedron / Torus Knot)
  const geomOuter = new THREE.IcosahedronGeometry(7, 2);
  const matOuter = new THREE.MeshBasicMaterial({
    color: 0xC6FF3D, // Acid Lime
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const meshOuter = new THREE.Mesh(geomOuter, matOuter);
  coreGroup.add(meshOuter);

  // 2. Inner Glowing Cyber Ring / Torus Knot
  const geomTorus = new THREE.TorusKnotGeometry(4.2, 0.9, 120, 16, 2, 3);
  const matTorus = new THREE.MeshBasicMaterial({
    color: 0x00F0FF, // Cyber Cyan
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const meshTorus = new THREE.Mesh(geomTorus, matTorus);
  coreGroup.add(meshTorus);

  // 3. Central Solid Core
  const geomCore = new THREE.OctahedronGeometry(2.5, 0);
  const matCore = new THREE.MeshBasicMaterial({
    color: 0xC6FF3D,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const meshCore = new THREE.Mesh(geomCore, matCore);
  coreGroup.add(meshCore);

  // 4. Floating Particle Nebula
  const particleCount = 280;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorAcid = new THREE.Color(0xC6FF3D);
  const colorCyan = new THREE.Color(0x00F0FF);
  const colorWhite = new THREE.Color(0xFFFFFF);

  for (let i = 0; i < particleCount; i++) {
    const radius = 9 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const chosenColor = Math.random() > 0.5 ? colorAcid : (Math.random() > 0.3 ? colorCyan : colorWhite);
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  coreGroup.add(particleSystem);

  // Mouse Interaction Physics with Damping
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) * 0.0008;
    mouseY = (e.clientY - windowHalfY) * 0.0008;
  }, { passive: true });

  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  // Click shockwave expansion
  container.addEventListener('click', () => {
    meshOuter.scale.set(1.25, 1.25, 1.25);
    matOuter.opacity = 0.8;
    matTorus.opacity = 0.9;
    if (window.showToast) window.showToast('Pulso cuántico emitido // 3D Core Reactivo', 'success');
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant orbital rotation
    coreGroup.rotation.y = elapsedTime * 0.25;
    coreGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;

    meshTorus.rotation.z = elapsedTime * 0.35;
    meshTorus.rotation.y = elapsedTime * 0.4;

    meshCore.rotation.x = -elapsedTime * 0.6;
    meshCore.rotation.y = elapsedTime * 0.6;

    // Smooth recovery from click pulse
    meshOuter.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
    matOuter.opacity = THREE.MathUtils.lerp(matOuter.opacity, isHovered ? 0.45 : 0.28, 0.05);
    matTorus.opacity = THREE.MathUtils.lerp(matTorus.opacity, isHovered ? 0.6 : 0.35, 0.05);

    // Mouse spring damping
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
}

document.addEventListener('DOMContentLoaded', initThreeHero);
