
import React, { useRef, useEffect } from 'react';

const SpatialCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    const points: { x: number; y: number; vx: number; vy: number; size: number; secure: boolean; pulse: number }[] = [];
    const numPoints = 85;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        secure: Math.random() > 0.8,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      // Topographic "Signal Density" Gradient Background
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.5);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Grid with slight depth
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = (time * 0.01) % step; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = (time * 0.01) % step; y < height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Connections (Neural Mesh Fibers)
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const isSecure = points[i].secure && points[j].secure;
            const opacity = (1 - dist / 160) * 0.3;
            
            ctx.strokeStyle = isSecure 
              ? `rgba(139, 92, 246, ${opacity * 2})` 
              : `rgba(59, 130, 246, ${opacity})`;
            
            ctx.setLineDash(isSecure ? [2, 6] : []);
            ctx.lineWidth = isSecure ? 1.2 : 0.8;

            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Draw Nodes (Sovereign Terminals)
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const pulseScale = 1 + Math.sin(p.pulse) * 0.2;
        
        if (p.secure) {
          ctx.fillStyle = '#a855f7';
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        } else {
          ctx.fillStyle = '#3b82f6';
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // "Satellite" orbit around secure nodes
        if (p.secure) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10 * pulseScale, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default SpatialCanvas;
