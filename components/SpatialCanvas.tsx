
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

interface SpatialCanvasProps {
  isDroneView?: boolean;
}

const SpatialCanvas: React.FC<SpatialCanvasProps> = ({ isDroneView = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const scannerLightRef = useRef<THREE.PointLight | null>(null);
  const movementBeaconRef = useRef<THREE.PointLight | null>(null);
  const userPathRef = useRef<THREE.Line | null>(null);
  const userPointsRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!cameraRef.current) return;
    const targetPos = isDroneView ? new THREE.Vector3(120, 40, 180) : new THREE.Vector3(350, 250, 500);
    const startPos = cameraRef.current.position.clone();
    
    let alpha = 0;
    const animateCamera = () => {
      alpha += 0.015;
      const easedAlpha = 1 - Math.pow(1 - alpha, 3);
      cameraRef.current?.position.lerpVectors(startPos, targetPos, Math.min(easedAlpha, 1));
      if (alpha < 1) requestAnimationFrame(animateCamera);
    };
    animateCamera();
  }, [isDroneView]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.0006);

    const camera = new THREE.PerspectiveCamera(65, width / height, 1, 10000);
    camera.position.set(350, 250, 500);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = !isDroneView;
    controls.autoRotateSpeed = 0.15;
    controlsRef.current = controls;

    // --- POST PROCESSING (REFINED SSAO) ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Fine-tuned SSAO for deep occlusion in the mesh environment
    const ssaoPass = new SSAOPass(scene, camera, width, height);
    ssaoPass.kernelRadius = 48; // Increased for broader shadows
    ssaoPass.minDistance = 0.001; 
    ssaoPass.maxDistance = 0.15;
    ssaoPass.output = SSAOPass.OUTPUT.Default;
    composer.addPass(ssaoPass);
    composerRef.current = composer;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.1);
    scene.add(ambientLight);

    const scannerLight = new THREE.PointLight(0x3b82f6, 0, 2500);
    scene.add(scannerLight);
    scannerLightRef.current = scannerLight;

    const movementBeacon = new THREE.PointLight(0x60a5fa, 0, 400);
    scene.add(movementBeacon);
    movementBeaconRef.current = movementBeacon;

    // --- DATA DUST ---
    const dustCount = 3000;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 5000;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 2500;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 5000;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 1.2,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // --- STRUCTURAL MONOLITHS (Shadow Catchers for SSAO) ---
    const monoGeom = new THREE.BoxGeometry(40, 600, 40);
    const monoMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5
    });

    for (let i = 0; i < 12; i++) {
      const mono = new THREE.Mesh(monoGeom, monoMat);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1200 + Math.random() * 400;
      mono.position.set(
        Math.cos(angle) * radius,
        150,
        Math.sin(angle) * radius
      );
      mono.rotation.y = Math.random() * Math.PI;
      scene.add(mono);
    }

    // --- PERSONAL KINETIC PATH ---
    const pathMat = new THREE.LineBasicMaterial({ 
      color: 0x60a5fa, 
      transparent: true, 
      opacity: 0.6,
      linewidth: 2 
    });
    const pathGeom = new THREE.BufferGeometry();
    const userPath = new THREE.Line(pathGeom, pathMat);
    scene.add(userPath);
    userPathRef.current = userPath;

    // --- CRYSTALLINE MESH NODES ---
    const nodesGroup = new THREE.Group();
    const nodeGeom = new THREE.IcosahedronGeometry(10, 2);
    const nodeMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x3b82f6, 
      emissive: 0x1d4ed8, 
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.4,
      ior: 1.5,
      thickness: 1,
      iridescence: 1,
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 45; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat.clone());
      const angle = (i / 45) * Math.PI * 2;
      const radius = 500 + Math.random() * 900;
      node.position.set(
        Math.cos(angle) * radius,
        Math.random() * 400 - 150,
        Math.sin(angle) * radius
      );
      node.scale.setScalar(0.8 + Math.random() * 1.5);
      nodesGroup.add(node);
    }
    scene.add(nodesGroup);

    // --- NEURAL FILAMENTS ---
    const filaments = new THREE.Group();
    const filMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.05 });
    nodesGroup.children.forEach((n1, i) => {
      nodesGroup.children.slice(i + 1).forEach(n2 => {
        if (n1.position.distanceTo(n2.position) < 450) {
          const g = new THREE.BufferGeometry().setFromPoints([n1.position, n2.position]);
          filaments.add(new THREE.Line(g, filMat));
        }
      });
    });
    scene.add(filaments);

    // --- GRID ---
    const grid = new THREE.GridHelper(6000, 60, 0x1e293b, 0x0f172a);
    grid.position.y = -200;
    scene.add(grid);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Kinetic Movement Staking Simulation
      if (time % 1.5 < 0.02) {
        const last = userPointsRef.current[userPointsRef.current.length - 1] || new THREE.Vector3(0, 0, 0);
        const next = last.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          Math.sin(time * 0.5) * 5,
          (Math.random() - 0.5) * 40
        ));
        userPointsRef.current.push(next);
        if (userPointsRef.current.length > 120) userPointsRef.current.shift();
        userPathRef.current?.geometry.setFromPoints(userPointsRef.current);
        
        // Update Beacon to Head of Path
        if (movementBeaconRef.current) {
          movementBeaconRef.current.position.copy(next);
          movementBeaconRef.current.intensity = 15 + Math.sin(time * 4) * 5;
        }
      }

      // Scanner Pulse Intensity
      const pulse = (time % 4) / 4;
      if (scannerLightRef.current) {
        scannerLightRef.current.intensity = (1 - pulse) * 40;
        scannerLightRef.current.distance = pulse * 2000;
        scannerLightRef.current.position.set(0, Math.sin(time) * 150, 0);
      }

      // Node Rotation and Bloom
      nodesGroup.children.forEach((node: any, i) => {
        node.rotation.x += 0.005;
        node.rotation.z += 0.005;
        node.position.y += Math.sin(time * 0.6 + i) * 0.15;
        node.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time + i)) * 1.5;
        node.material.opacity = 0.6 + Math.sin(time * 0.5 + i) * 0.1;
      });

      // Dust Swirl
      dust.rotation.y += 0.0002;

      controls.update();
      if (composerRef.current) composerRef.current.render();
      else renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-auto select-none" />;
};

export default SpatialCanvas;
