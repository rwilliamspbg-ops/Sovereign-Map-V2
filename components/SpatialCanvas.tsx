
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

  // Transition Camera based on View Mode
  useEffect(() => {
    if (!cameraRef.current) return;
    const targetPos = isDroneView ? new THREE.Vector3(120, 40, 180) : new THREE.Vector3(350, 250, 500);
    const startPos = cameraRef.current.position.clone();
    
    let alpha = 0;
    const animateCamera = () => {
      alpha += 0.015;
      const easedAlpha = 1 - Math.pow(1 - alpha, 3); // Cubic ease-out
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
    // Volumetric Fog for deep atmospheric immersion
    scene.fog = new THREE.FogExp2(0x020617, 0.0012);

    const camera = new THREE.PerspectiveCamera(65, width / height, 1, 5000);
    camera.position.set(350, 250, 500);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Antialiasing handled by post-processing/limited pixel ratio
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized for performance
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.autoRotate = !isDroneView;
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    // --- POST PROCESSING (AO) ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const ssaoPass = new SSAOPass(scene, camera, width, height);
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.1;
    ssaoPass.output = SSAOPass.OUTPUT.Default;
    composer.addPass(ssaoPass);
    composerRef.current = composer;

    // --- ENHANCED LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x3b82f6, 1.5);
    mainLight.position.set(500, 1000, 500);
    scene.add(mainLight);

    // Dynamic Scanner Light (Pulse)
    const scannerLight = new THREE.PointLight(0x3b82f6, 0, 800);
    scannerLight.position.y = -90;
    scene.add(scannerLight);
    scannerLightRef.current = scannerLight;

    // --- RECTIVE GROUND PLANE ---
    const groundGeom = new THREE.PlaneGeometry(3000, 3000, 64, 64);
    const groundMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1d,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -100;
    scene.add(ground);

    // Grid Overlay
    const grid = new THREE.GridHelper(3000, 60, 0x1e293b, 0x0f172a);
    grid.position.y = -99.9;
    scene.add(grid);

    // --- CRYSTALLINE MESH NODES ---
    const nodesGroup = new THREE.Group();
    const nodeGeom = new THREE.IcosahedronGeometry(8, 2);
    
    // High-quality Physical Material
    const nodeMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x3b82f6, 
      emissive: 0x1d4ed8, 
      emissiveIntensity: 1.2,
      metalness: 0.95,
      roughness: 0.05,
      transmission: 0.4,
      thickness: 3,
      transparent: true,
      opacity: 0.9,
      envMapIntensity: 1
    });

    const shieldGeom = new THREE.SphereGeometry(12, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.03 
    });

    for (let i = 0; i < 24; i++) {
      const nodeWrap = new THREE.Group();
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat.clone()); // Unique material per node for pulse effects
      const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
      
      nodeWrap.add(nodeMesh);
      nodeWrap.add(shieldMesh);
      
      const angle = (i / 24) * Math.PI * 2;
      const radius = 350 + Math.random() * 550;
      nodeWrap.position.set(
        Math.cos(angle) * radius,
        Math.random() * 250 - 25,
        Math.sin(angle) * radius
      );
      
      const s = 0.6 + Math.random() * 1.4;
      nodeWrap.scale.set(s, s, s);
      
      nodesGroup.add(nodeWrap);
    }
    scene.add(nodesGroup);

    // --- NEURAL PATHWAYS ---
    const lineMat = new THREE.LineBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.12 
    });
    
    const createConnections = () => {
      const lineGeom = new THREE.BufferGeometry();
      const linePos = [];
      const children = nodesGroup.children;
      for (let i = 0; i < children.length; i++) {
        for (let j = i + 1; j < children.length; j++) {
          const dist = children[i].position.distanceTo(children[j].position);
          if (dist < 450) {
            linePos.push(children[i].position.x, children[i].position.y, children[i].position.z);
            linePos.push(children[j].position.x, children[j].position.y, children[j].position.z);
          }
        }
      }
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
      return new THREE.LineSegments(lineGeom, lineMat);
    };
    
    const connections = createConnections();
    scene.add(connections);

    // --- VOLUMETRIC SCANNER ---
    const scannerGeom = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const scannerMat = new THREE.MeshBasicMaterial({ 
      color: 0x60a5fa, 
      transparent: true, 
      opacity: 0.6 
    });
    const scanner = new THREE.Mesh(scannerGeom, scannerMat);
    scanner.rotation.x = Math.PI / 2;
    scanner.position.y = -98;
    scene.add(scanner);

    // --- STARFIELD ---
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 5000;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 2500;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 5000;
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1.2, 
      transparent: true, 
      opacity: 0.35,
      sizeAttenuation: true 
    });
    const stars = new THREE.Points(starsGeom, starMat);
    scene.add(stars);

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Scanner Ring Pulse
      const scanCycle = (time % 6) / 6;
      const scanRadius = scanCycle * 1800;
      scanner.scale.set(scanRadius, scanRadius, 1);
      scanner.material.opacity = Math.pow(1 - scanCycle, 2) * 0.7;
      
      if (scannerLightRef.current) {
        scannerLightRef.current.intensity = scanner.material.opacity * 30;
        scannerLightRef.current.distance = scanRadius + 250;
      }

      // Nodes kinetic behavior
      nodesGroup.children.forEach((wrap, i) => {
        const node = wrap.children[0] as THREE.Mesh;
        const shield = wrap.children[1] as THREE.Mesh;
        
        node.rotation.y += 0.004 + (i * 0.0001);
        node.rotation.x += 0.001;
        wrap.position.y += Math.sin(time * 0.4 + i) * 0.15;
        
        const pulse = Math.sin(time * 1.5 + i) * 0.5 + 0.5;
        (node.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.8 + pulse * 1.5;
        shield.rotation.z -= 0.008;
        shield.scale.setScalar(1 + pulse * 0.08);
      });

      stars.rotation.y += 0.00005;
      ground.position.y = -100 + Math.sin(time * 0.25) * 0.4;

      controls.update();
      
      // Use composer instead of renderer directly for AO
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
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
