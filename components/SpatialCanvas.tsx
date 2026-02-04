
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Settings, Eye, Palette, Grid3X3, Wind, Box, Navigation, Layers } from 'lucide-react';

interface SpatialCanvasProps {
  grouped?: boolean;
}

const SpatialCanvas: React.FC<SpatialCanvasProps> = ({ grouped = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tracking & Style State
  const [featColor, setFeatColor] = useState('#4ade80');
  const [featOpacity, setFeatOpacity] = useState(0.8);
  
  // Environment Controls State
  const [showGrid, setShowGrid] = useState(true);
  const [fogDensity, setFogDensity] = useState(0.002);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs for Three.js objects
  const featureMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const nodeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const clustersGroupRef = useRef<THREE.Group | null>(null);

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

  // Handle grouping visibility toggle
  useEffect(() => {
    if (nodesGroupRef.current) nodesGroupRef.current.visible = !grouped;
    if (clustersGroupRef.current) clustersGroupRef.current.visible = grouped;
  }, [grouped]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x3b82f6, 2, 1000);
    pointLight.position.set(0, 200, 0);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(2000, 50, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -50;
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // --- INDIVIDUAL NODES ---
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
    nodesGroupRef.current = nodesGroup;
    nodesGroup.visible = !grouped;
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.2) * 400;
      const z = (Math.random() - 0.5) * 800;
      mesh.position.set(x, y, z);
      nodesGroup.add(mesh);
    }
    scene.add(nodesGroup);

    // --- CLUSTERS (Sovereign Hubs) ---
    const clusterCount = 5;
    const clusterGeometry = new THREE.OctahedronGeometry(15);
    const clusterMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.8,
      wireframe: true
    });
    const clustersGroup = new THREE.Group();
    clustersGroupRef.current = clustersGroup;
    clustersGroup.visible = grouped;

    for (let i = 0; i < clusterCount; i++) {
      const mesh = new THREE.Mesh(clusterGeometry, clusterMaterial);
      const x = (Math.random() - 0.5) * 600;
      const y = (Math.random() - 0.1) * 300;
      const z = (Math.random() - 0.5) * 600;
      mesh.position.set(x, y, z);
      clustersGroup.add(mesh);

      // Add "shield" or range sphere for clusters
      const rangeGeom = new THREE.SphereGeometry(60, 16, 16);
      const rangeMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.03, wireframe: true });
      const rangeMesh = new THREE.Mesh(rangeGeom, rangeMat);
      rangeMesh.position.set(x, y, z);
      clustersGroup.add(rangeMesh);
    }
    scene.add(clustersGroup);

    // --- FLIGHT CORRIDOR (Glow Path) ---
    const curvePoints = [
      new THREE.Vector3(-400, 100, -400),
      new THREE.Vector3(-100, 150, 0),
      new THREE.Vector3(200, 250, 300),
      new THREE.Vector3(500, 100, 500)
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 2, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const flightTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(flightTube);

    // --- KINETIC ENTITY (Drone Marker) ---
    const droneGeometry = new THREE.ConeGeometry(8, 16, 4);
    const droneMaterial = new THREE.MeshPhongMaterial({
      color: 0x4ade80,
      emissive: 0x22c55e,
      emissiveIntensity: 0.8
    });
    const drone = new THREE.Mesh(droneGeometry, droneMaterial);
    drone.rotateX(Math.PI / 2);
    scene.add(drone);

    // --- SLAM FEATURES ---
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
    const featCount = 80;
    const featGeom = new THREE.BufferGeometry();
    const featPos = new Float32Array(featCount * 3);
    for(let i=0; i<featCount; i++){
      featPos[i*3] = (Math.random()-0.5)*700;
      featPos[i*3+1] = (Math.random()-0.5)*350;
      featPos[i*3+2] = (Math.random()-0.5)*700;
    }
    featGeom.setAttribute('position', new THREE.BufferAttribute(featPos, 3));
    const features = new THREE.Points(featGeom, featureMaterial);
    scene.add(features);

    // --- ANIMATION ---
    let frameId: number;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.001;
      
      const pos = curve.getPointAt(t % 1);
      drone.position.copy(pos);
      const tangent = curve.getTangentAt(t % 1);
      drone.lookAt(pos.clone().add(tangent));
      drone.rotateX(Math.PI / 2);

      tubeMaterial.opacity = 0.2 + Math.sin(t * 10) * 0.1;
      
      nodesGroup.rotation.y += 0.0002;
      clustersGroup.rotation.y -= 0.0001;
      clustersGroup.children.forEach((c, idx) => {
        if (c instanceof THREE.Mesh) {
           c.rotation.x += 0.01;
           c.rotation.z += 0.01;
        }
      });

      features.rotation.y -= 0.0005;

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
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative group cursor-move">
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-lg">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-[9px] font-black text-white uppercase tracking-widest">
               {grouped ? 'STRATEGIC HUB VIEW' : 'SLAM ENGINE: LOCKED'}
             </p>
           </div>
           <div className="flex gap-4 text-[8px] font-mono text-slate-400">
             <span>Sectors: {grouped ? '5 Clusters' : 'Direct'}</span>
             <span>Health: Nominal</span>
           </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-blue-400 transition-all pointer-events-auto shadow-xl"
        >
          <Settings size={18} />
        </button>

        {showSettings && (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-72 space-y-6 animate-in slide-in-from-right-4 duration-300 pointer-events-auto shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Box size={14} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Environment Layers</h4>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase">Grid</div>
                <button onClick={() => setShowGrid(!showGrid)} className={`w-8 h-4 rounded-full ${showGrid ? 'bg-blue-600' : 'bg-slate-800'}`}></button>
              </div>

              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                   <div className="text-[10px] font-bold text-slate-300 uppercase">Fog</div>
                   <span className="text-[9px] font-mono text-blue-400">{(fogDensity * 1000).toFixed(1)}</span>
                </div>
                <input type="range" min="0" max="0.01" step="0.0001" value={fogDensity} onChange={e=>setFogDensity(parseFloat(e.target.value))} className="w-full accent-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none text-[9px] font-black text-blue-400 uppercase tracking-widest">
        Orbit: Left Click | Zoom: Scroll | Pan: Right Click
      </div>
    </div>
  );
};

export default SpatialCanvas;
