
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SpatialCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.002);

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 2000);
    camera.position.set(200, 150, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.maxDistance = 800;
    controls.minDistance = 50;

    // --- GRID FLOOR ---
    const gridHelper = new THREE.GridHelper(2000, 50, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // --- MESH NODES ---
    const pointCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const sizes = new Float32Array(pointCount);

    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < pointCount; i++) {
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.2) * 400;
      const z = (Math.random() - 0.5) * 800;
      
      nodes.push(new THREE.Vector3(x, y, z));
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation (Blue to Purple)
      const r = 0.2 + Math.random() * 0.2;
      const g = 0.4 + Math.random() * 0.2;
      const b = 0.8 + Math.random() * 0.2;
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      sizes[i] = Math.random() * 15 + 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      map: sprite,
      transparent: true,
      alphaTest: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- CONNECTIONS (LINES) ---
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.15,
      blending: THREE.AdditiveBlending 
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    // Simple nearest neighbor connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 180) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- ANIMATION ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Gentle rotation for background movement
      points.rotation.y += 0.0005;
      lines.rotation.y += 0.0005;

      // Pulse sizes
      const time = Date.now() * 0.002;
      const sizesArray = geometry.attributes.size.array as Float32Array;
      for (let i = 0; i < pointCount; i++) {
        sizesArray[i] = (Math.sin(time + i) + 1.5) * 4;
      }
      geometry.attributes.size.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative group cursor-move">
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Orbit: Left Click | Zoom: Scroll | Pan: Right Click</p>
      </div>
    </div>
  );
};

export default SpatialCanvas;
