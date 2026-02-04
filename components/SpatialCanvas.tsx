import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Settings, Eye, Palette, Grid3X3, Wind, Box } from 'lucide-react';

const SpatialCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tracking & Style State
  const [featColor, setFeatColor] = useState('#4ade80');
  const [featOpacity, setFeatOpacity] = useState(0.8);
  
  // Environment Controls State
  const [showGrid, setShowGrid] = useState(true);
  const [fogDensity, setFogDensity] = useState(0.002);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs for Three.js objects to update them without re-mounting
  const featureMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const nodeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Synchronize Three.js objects with React state
  useEffect(() => {
    if (featureMaterialRef.current) {
      featureMaterialRef.current.color.set(featColor);
      featureMaterialRef.current.opacity = featOpacity;
    }
  }, [featColor, featOpacity]);

  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = showGrid;
  }, [showGrid]);

  useEffect(() => {
    if (fogRef.current) fogRef.current.density = fogDensity;
  }, [fogDensity]);

  useEffect(() => {
    if (nodeMaterialRef.current) nodeMaterialRef.current.wireframe = wireframeMode;
  }, [wireframeMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x020617, fogDensity);
    scene.fog = fog;
    fogRef.current = fog;

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
    controls.maxDistance = 1000;
    controls.minDistance = 20;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x3b82f6, 2, 1000);
    pointLight.position.set(0, 200, 0);
    scene.add(pointLight);

    // --- GRID FLOOR ---
    const gridHelper = new THREE.GridHelper(2000, 50, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -50;
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // --- MESH NODES (Physical Spheres for Wireframe Support) ---
    const nodeCount = 60;
    const nodeGeometry = new THREE.SphereGeometry(4, 12, 12);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      wireframe: wireframeMode
    });
    nodeMaterialRef.current = nodeMaterial;

    const nodesGroup = new THREE.Group();
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.2) * 400;
      const z = (Math.random() - 0.5) * 800;
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
      nodesGroup.add(mesh);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }
    scene.add(nodesGroup);

    // --- SLAM FEATURE TRACKING POINTS ---
    const featureCount = 80;
    const featureGeometry = new THREE.BufferGeometry();
    const featurePositionsArray = new Float32Array(featureCount * 3);
    for (let i = 0; i < featureCount; i++) {
      featurePositionsArray[i * 3] = (Math.random() - 0.5) * 700;
      featurePositionsArray[i * 3 + 1] = (Math.random() - 0.5) * 350;
      featurePositionsArray[i * 3 + 2] = (Math.random() - 0.5) * 700;
    }
    featureGeometry.setAttribute('position', new THREE.BufferAttribute(featurePositionsArray, 3));
    
    const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
    const featureMaterial = new THREE.PointsMaterial({
      size: 3,
      color: featColor,
      map: sprite,
      transparent: true,
      opacity: featOpacity,
      blending: THREE.AdditiveBlending,
    });
    featureMaterialRef.current = featureMaterial;
    
    const features = new THREE.Points(featureGeometry, featureMaterial);
    scene.add(features);

    // --- CONNECTIONS (Lines between nodes) ---
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.15,
      blending: THREE.AdditiveBlending 
    });
    const linePositions: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 180) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- ANIMATION ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      nodesGroup.rotation.y += 0.0002;
      lines.rotation.y += 0.0002;
      features.rotation.y -= 0.0005;

      const time = Date.now() * 0.001;
      nodesGroup.children.forEach((child, i) => {
        child.position.y += Math.sin(time + i) * 0.1;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

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
      {/* SLAM HUD OVERLAY */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[9px] font-black text-white uppercase tracking-widest">SLAM ENGINE: LOCKED</p>
           </div>
           <div className="flex gap-4 text-[8px] font-mono text-slate-400">
             <span>FPS: 60</span>
             <span>FEATURES: 248</span>
             <span>KEYFRAMES: 12</span>
           </div>
        </div>
      </div>

      {/* ADVANCED VISIBILITY & ENVIRONMENT CONTROLS */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-blue-400 transition-all pointer-events-auto shadow-xl"
        >
          <Settings size={18} className={showSettings ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>

        {showSettings && (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-72 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300 pointer-events-auto shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            
            {/* Environment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Box size={14} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Environment Layers</h4>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <Grid3X3 size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Surface Grid</span>
                </div>
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={`w-10 h-5 rounded-full transition-all relative ${showGrid ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showGrid ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <Box size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Node Wireframe</span>
                </div>
                <button 
                  onClick={() => setWireframeMode(!wireframeMode)}
                  className={`w-10 h-5 rounded-full transition-all relative ${wireframeMode ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${wireframeMode ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Wind size={14} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Fog Density</span>
                  </div>
                  <span className="text-[9px] font-mono text-blue-400">{(fogDensity * 1000).toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.01" 
                  step="0.0001" 
                  value={fogDensity} 
                  onChange={(e) => setFogDensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Tracking Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">SLAM Tracking</h4>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Marker Opacity</span>
                  <span className="text-[9px] font-mono text-blue-400">{Math.round(featOpacity * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={featOpacity} 
                  onChange={(e) => setFeatOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <Palette size={10} className="text-slate-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Marker Color</span>
                  </div>
                  <span className="text-[9px] font-mono text-blue-400 uppercase">{featColor}</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={featColor}
                    onChange={(e) => setFeatColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer p-0 overflow-hidden"
                  />
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {['#4ade80', '#3b82f6', '#f59e0b', '#ef4444', '#ffffff'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setFeatColor(c)}
                        className={`w-6 h-6 rounded-md border border-white/5 transition-transform hover:scale-110 active:scale-95`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
               <p className="text-[8px] text-slate-500 leading-relaxed font-medium">
                 Tune the visual output to match specific operational lighting conditions. Fog density improves depth perception in dense mesh sectors.
               </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none">
        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Orbit: Left Click | Zoom: Scroll | Pan: Right Click</p>
      </div>
    </div>
  );
};

export default SpatialCanvas;