"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * NeuralFlowBackground — A cinematic Three.js background for the ARIA dashboard.
 *
 * Features:
 *  • Three concentric rings of nodes representing the 3 pipeline stages
 *    (teal = VAE, amber = PSO, violet = Dream)
 *  • Data particles flow along curved spline paths between nodes
 *  • Subtle glow pulses and depth fog for atmosphere
 *  • Mouse-reactive parallax camera shift
 *  • Fully contained, no external deps beyond three.js
 */
export function NeuralFlowBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ─── Setup ──────────────────────────────────────────────
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070810, 0.0012);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 350);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (container.children.length > 0) container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // ─── Color Palette ──────────────────────────────────────
    const TEAL   = new THREE.Color(0x00d4aa);
    const AMBER  = new THREE.Color(0xf5a623);
    const VIOLET = new THREE.Color(0xa78bfa);
    const stageColors = [TEAL, AMBER, VIOLET];

    // ─── Node Network ───────────────────────────────────────
    // 3 concentric rings of nodes: inner (VAE), middle (PSO), outer (Dream)
    const nodePositions: THREE.Vector3[] = [];
    const nodeColors: THREE.Color[] = [];
    const nodePulsePhases: number[] = [];
    const ringRadii = [60, 130, 210];
    const ringCounts = [8, 14, 20];

    ringRadii.forEach((radius, ring) => {
      const count = ringCounts[ring];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + ring * 0.3;
        const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
        const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 80;
        nodePositions.push(new THREE.Vector3(x, y, z));
        nodeColors.push(stageColors[ring].clone());
        nodePulsePhases.push(Math.random() * Math.PI * 2);
      }
    });

    // Instanced mesh for nodes
    const nodeGeo = new THREE.SphereGeometry(2.5, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodesMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, nodePositions.length);

    const dummy = new THREE.Object3D();
    const instanceColor = new Float32Array(nodePositions.length * 3);
    nodePositions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      nodesMesh.setMatrixAt(i, dummy.matrix);
      instanceColor[i * 3]     = nodeColors[i].r;
      instanceColor[i * 3 + 1] = nodeColors[i].g;
      instanceColor[i * 3 + 2] = nodeColors[i].b;
    });
    nodesMesh.instanceMatrix.needsUpdate = true;
    nodesMesh.geometry.setAttribute("color", new THREE.InstancedBufferAttribute(instanceColor, 3));
    nodeMat.vertexColors = true;
    scene.add(nodesMesh);

    // ─── Connection Edges ───────────────────────────────────
    // Static edges between nearby nodes (within same ring + cross-ring bridges)
    const edgePositions: number[] = [];
    const edgeColors: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 90) {
          edgePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
          const mixColor = nodeColors[i].clone().lerp(nodeColors[j], 0.5);
          edgeColors.push(mixColor.r, mixColor.g, mixColor.b);
          edgeColors.push(mixColor.r, mixColor.g, mixColor.b);
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute("color", new THREE.Float32BufferAttribute(edgeColors, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edges);

    // ─── Flowing Data Particles ─────────────────────────────
    // Particles that travel along curved spline paths between node pairs
    interface FlowParticle {
      path: THREE.CatmullRomCurve3;
      t: number;
      speed: number;
      color: THREE.Color;
    }

    const flowParticles: FlowParticle[] = [];
    const flowCount = 80;
    const flowGeo = new THREE.SphereGeometry(1, 6, 6);
    const flowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flowMesh = new THREE.InstancedMesh(flowGeo, flowMat, flowCount);
    const flowInstanceColor = new Float32Array(flowCount * 3);

    for (let f = 0; f < flowCount; f++) {
      const iA = Math.floor(Math.random() * nodePositions.length);
      let iB = Math.floor(Math.random() * nodePositions.length);
      while (iB === iA) iB = Math.floor(Math.random() * nodePositions.length);
      const pA = nodePositions[iA];
      const pB = nodePositions[iB];
      const mid = pA.clone().lerp(pB, 0.5);
      // Create a curve with a random bulge
      const bulge = new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40
      );
      mid.add(bulge);
      const path = new THREE.CatmullRomCurve3([pA.clone(), mid, pB.clone()]);
      const color = nodeColors[iA].clone().lerp(nodeColors[iB], 0.5);

      flowParticles.push({
        path,
        t: Math.random(),
        speed: 0.001 + Math.random() * 0.003,
        color,
      });

      flowInstanceColor[f * 3]     = color.r;
      flowInstanceColor[f * 3 + 1] = color.g;
      flowInstanceColor[f * 3 + 2] = color.b;
    }

    flowMesh.geometry.setAttribute("color", new THREE.InstancedBufferAttribute(flowInstanceColor, 3));
    flowMat.vertexColors = true;
    scene.add(flowMesh);

    // ─── Ambient Dust Particles ─────────────────────────────
    const dustCount = 400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositionsArr = new Float32Array(dustCount * 3);
    const dustVelocities: THREE.Vector3[] = [];
    for (let d = 0; d < dustCount; d++) {
      dustPositionsArr[d * 3]     = (Math.random() - 0.5) * 800;
      dustPositionsArr[d * 3 + 1] = (Math.random() - 0.5) * 800;
      dustPositionsArr[d * 3 + 2] = (Math.random() - 0.5) * 400;
      dustVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.05
        )
      );
    }
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPositionsArr, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x5b8dff,
      size: 1.2,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // ─── Orbital Rings (subtle) ─────────────────────────────
    ringRadii.forEach((radius, i) => {
      const ringCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
      const points = ringCurve.getPoints(128);
      const ringGeoLine = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );
      const ringMat = new THREE.LineBasicMaterial({
        color: stageColors[i],
        transparent: true,
        opacity: 0.04,
      });
      const ring = new THREE.LineLoop(ringGeoLine, ringMat);
      scene.add(ring);
    });

    // ─── Mouse & Resize ─────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ─── Animate ────────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Pulse nodes
      for (let i = 0; i < nodePositions.length; i++) {
        const scale = 0.8 + Math.sin(t * 1.5 + nodePulsePhases[i]) * 0.4;
        dummy.position.copy(nodePositions[i]);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        nodesMesh.setMatrixAt(i, dummy.matrix);
      }
      nodesMesh.instanceMatrix.needsUpdate = true;

      // Edge pulse
      edgeMat.opacity = 0.06 + Math.sin(t * 0.8) * 0.03;

      // Flow particles
      for (let f = 0; f < flowCount; f++) {
        const fp = flowParticles[f];
        fp.t += fp.speed;
        if (fp.t > 1) fp.t = 0;
        const pt = fp.path.getPointAt(fp.t);
        dummy.position.copy(pt);
        const pulse = 0.6 + Math.sin(t * 3 + f) * 0.4;
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        flowMesh.setMatrixAt(f, dummy.matrix);
      }
      flowMesh.instanceMatrix.needsUpdate = true;

      // Dust drift
      const dustPos = dustGeo.attributes.position as THREE.BufferAttribute;
      for (let d = 0; d < dustCount; d++) {
        dustPos.setX(d, dustPos.getX(d) + dustVelocities[d].x);
        dustPos.setY(d, dustPos.getY(d) + dustVelocities[d].y);
        dustPos.setZ(d, dustPos.getZ(d) + dustVelocities[d].z);

        // Wrap
        if (Math.abs(dustPos.getX(d)) > 400) dustPos.setX(d, -dustPos.getX(d));
        if (Math.abs(dustPos.getY(d)) > 400) dustPos.setY(d, -dustPos.getY(d));
        if (Math.abs(dustPos.getZ(d)) > 200) dustPos.setZ(d, -dustPos.getZ(d));
      }
      dustPos.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mouseX * 30 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 20 - camera.position.y) * 0.02;

      // Slow auto-rotation
      scene.rotation.z = t * 0.02;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}
