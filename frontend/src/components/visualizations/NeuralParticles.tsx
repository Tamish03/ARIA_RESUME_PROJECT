"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NeuralParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    // Use depth fog matching base background
    scene.fog = new THREE.FogExp2(0x070810, 0.002);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear existing canvas if strict mode re-runs
    if (container.children.length > 0) {
      container.innerHTML = '';
    }
    container.appendChild(renderer.domElement);

    const numNodes = 60;
    const geometry = new THREE.SphereGeometry(1.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x5b8dff });
    
    const nodes = new THREE.InstancedMesh(geometry, material, numNodes);
    
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    
    const dummy = new THREE.Object3D();

    for (let i = 0; i < numNodes; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 200;
      
      positions.push(new THREE.Vector3(x, y, z));
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        )
      );
      
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    
    nodes.instanceMatrix.needsUpdate = true;
    scene.add(nodes);

    // Edges
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5b8dff,
      transparent: true,
      opacity: 0.15,
    });
    
    const maxEdges = (numNodes * (numNodes - 1)) / 2;
    const linePositions = new Float32Array(maxEdges * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    const linePositionAttr = new THREE.BufferAttribute(linePositions, 3);
    linePositionAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("position", linePositionAttr);
    lineGeometry.setDrawRange(0, 0);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    };
    
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
      // Update nodes
      let lineVertexCount = 0;
      
      for (let i = 0; i < numNodes; i++) {
        const p = positions[i];
        const v = velocities[i];
        
        p.add(v);
        
        // Bounds
        if (p.x > 200 || p.x < -200) v.x *= -1;
        if (p.y > 200 || p.y < -200) v.y *= -1;
        if (p.z > 100 || p.z < -100) v.z *= -1;
        
        // Mouse repel
        const distToMouseX = p.x - mouseX;
        const distToMouseY = p.y + mouseY;
        const dist = Math.sqrt(distToMouseX * distToMouseX + distToMouseY * distToMouseY);
        
        if (dist < 50) {
          p.x += distToMouseX * 0.01;
          p.y += distToMouseY * 0.01;
        }

        dummy.position.copy(p);
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
        
        // Edges
        for (let j = i + 1; j < numNodes; j++) {
          const p2 = positions[j];
          const d = p.distanceTo(p2);
          if (d < 60) {
            const offset = lineVertexCount * 3;
            linePositions[offset] = p.x;
            linePositions[offset + 1] = p.y;
            linePositions[offset + 2] = p.z;
            linePositions[offset + 3] = p2.x;
            linePositions[offset + 4] = p2.y;
            linePositions[offset + 5] = p2.z;
            lineVertexCount += 2;
          }
        }
      }
      
      nodes.instanceMatrix.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineVertexCount);
      linePositionAttr.needsUpdate = true;
      
      // Pulse lines
      lineMaterial.opacity = 0.1 + Math.sin(time * 2) * 0.05;

      // Slow camera rotation
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
