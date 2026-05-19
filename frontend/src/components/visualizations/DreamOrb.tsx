"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * DreamOrb — A morphing 3D sphere representing the DreamVAE's latent space.
 *
 * Features:
 *  • Icosahedron mesh with vertex displacement (organic morphing)
 *  • Inner wireframe core pulsing
 *  • Emitted "dream" particles flying outward from the surface
 *  • Violet/teal color palette matching the Dream stage
 *  • Subtle post-processing glow via additive blending
 */
export function DreamOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ─── Setup ────────────────────────────────────────────
    const scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500);
    camera.position.set(0, 0, 60);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (container.children.length > 0) container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const VIOLET = 0xa78bfa;
    const TEAL   = 0x00d4aa;

    // ─── Outer Morphing Shell ─────────────────────────────
    const shellGeo = new THREE.IcosahedronGeometry(15, 4);
    const shellMat = new THREE.MeshBasicMaterial({
      color: VIOLET,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // Store original positions for displacement
    const shellPositions = shellGeo.attributes.position;
    const originalPositions = new Float32Array(shellPositions.array.length);
    originalPositions.set(shellPositions.array);

    // ─── Inner Core ───────────────────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(7, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: TEAL,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ─── Inner Solid Glow ─────────────────────────────────
    const innerGlowGeo = new THREE.IcosahedronGeometry(5, 2);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: VIOLET,
      transparent: true,
      opacity: 0.15,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    scene.add(innerGlow);

    // ─── Orbital Rings ────────────────────────────────────
    const rings: THREE.LineLoop[] = [];
    for (let i = 0; i < 3; i++) {
      const radius = 20 + i * 4;
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y, 0));
      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({
        color: i === 1 ? TEAL : VIOLET,
        transparent: true,
        opacity: 0.08,
      });
      const ring = new THREE.LineLoop(ringGeo, ringMat);
      ring.rotation.x = (i * Math.PI) / 3;
      ring.rotation.y = (i * Math.PI) / 5;
      rings.push(ring);
      scene.add(ring);
    }

    // ─── Dream Emission Particles ─────────────────────────
    interface DreamParticle {
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      life: number;
      maxLife: number;
    }

    const maxEmitted = 60;
    const dreamParticles: DreamParticle[] = [];
    const emitGeo = new THREE.BufferGeometry();
    const emitPositions = new Float32Array(maxEmitted * 3);
    const emitColors = new Float32Array(maxEmitted * 3);
    const emitSizes = new Float32Array(maxEmitted);

    for (let i = 0; i < maxEmitted; i++) {
      emitPositions[i * 3] = 0;
      emitPositions[i * 3 + 1] = 0;
      emitPositions[i * 3 + 2] = 0;
      emitSizes[i] = 0;
      dreamParticles.push({
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0,
      });
    }

    emitGeo.setAttribute("position", new THREE.BufferAttribute(emitPositions, 3));
    emitGeo.setAttribute("color", new THREE.BufferAttribute(emitColors, 3));

    const emitMat = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const emitPoints = new THREE.Points(emitGeo, emitMat);
    scene.add(emitPoints);

    // Emit a dream particle from the surface
    const emitDream = () => {
      const idx = dreamParticles.findIndex(p => p.life <= 0);
      if (idx === -1) return;

      // Random point on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 15;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const dp = dreamParticles[idx];
      dp.pos.set(x, y, z);
      dp.vel.set(x, y, z).normalize().multiplyScalar(0.3 + Math.random() * 0.5);
      dp.life = 1;
      dp.maxLife = 2 + Math.random() * 3;

      // Color: mix between violet and teal
      const mix = Math.random();
      const c = new THREE.Color(VIOLET).lerp(new THREE.Color(TEAL), mix);
      emitColors[idx * 3] = c.r;
      emitColors[idx * 3 + 1] = c.g;
      emitColors[idx * 3 + 2] = c.b;
    };

    // ─── Resize ───────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ─── Animate ──────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId: number;
    let emitTimer = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // ── Morph Shell ──────────────────────────────────
      for (let i = 0; i < shellPositions.count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / dist;
        const ny = oy / dist;
        const nz = oz / dist;

        // Multi-frequency noise displacement
        const noise =
          Math.sin(ox * 0.15 + t * 1.2) * 1.5 +
          Math.sin(oy * 0.2 + t * 0.8) * 1.2 +
          Math.cos(oz * 0.18 + t * 1.5) * 1.0 +
          Math.sin((ox + oy) * 0.1 + t * 2.0) * 0.8;

        shellPositions.setXYZ(
          i,
          ox + nx * noise,
          oy + ny * noise,
          oz + nz * noise
        );
      }
      shellPositions.needsUpdate = true;
      shellGeo.computeVertexNormals();

      // Rotation
      shell.rotation.y = t * 0.15;
      shell.rotation.x = t * 0.08;

      // ── Core Pulse ──────────────────────────────────
      const coreScale = 1 + Math.sin(t * 2) * 0.15;
      core.scale.setScalar(coreScale);
      core.rotation.y = -t * 0.3;
      core.rotation.z = t * 0.1;
      coreMat.opacity = 0.3 + Math.sin(t * 3) * 0.2;

      // Inner glow
      innerGlow.scale.setScalar(coreScale * 0.9);
      innerGlowMat.opacity = 0.1 + Math.sin(t * 2.5) * 0.08;

      // ── Rings ───────────────────────────────────────
      rings.forEach((ring, i) => {
        ring.rotation.x += 0.002 * (i + 1);
        ring.rotation.z += 0.001 * (i + 1);
        (ring.material as THREE.LineBasicMaterial).opacity = 0.05 + Math.sin(t + i) * 0.03;
      });

      // ── Emit Dreams ─────────────────────────────────
      emitTimer += dt;
      if (emitTimer > 0.15) {
        emitTimer = 0;
        emitDream();
      }

      // Update dream particles
      const posAttr = emitGeo.attributes.position as THREE.BufferAttribute;
      dreamParticles.forEach((dp, i) => {
        if (dp.life > 0) {
          dp.life -= dt / dp.maxLife;
          dp.pos.add(dp.vel);
          dp.vel.multiplyScalar(0.99); // slow down
          posAttr.setXYZ(i, dp.pos.x, dp.pos.y, dp.pos.z);
        } else {
          posAttr.setXYZ(i, 9999, 9999, 9999); // hide off-screen
        }
      });
      posAttr.needsUpdate = true;
      (emitGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      emitMat.opacity = 0.5 + Math.sin(t * 1.5) * 0.2;

      // Shell color pulse
      shellMat.opacity = 0.25 + Math.sin(t * 1.8) * 0.1;

      // Camera subtle bob
      camera.position.y = Math.sin(t * 0.3) * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[250px]" />;
}
