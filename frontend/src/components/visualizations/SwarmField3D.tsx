"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SwarmField3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070810, 0.004);

    const w = container.clientWidth || 640;
    const h = container.clientHeight || 320;
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(120, 80, 120);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.replaceChildren(renderer.domElement);

    const AMBER = 0xf5a623;
    const AMBER_DIM = 0x8b6114;
    const BOUNDS = 50;

    const boxGeo = new THREE.BoxGeometry(BOUNDS * 2, BOUNDS * 2, BOUNDS * 2);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxLine = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.08 })
    );
    scene.add(boxLine);

    const gridHelper = new THREE.GridHelper(BOUNDS * 2, 12, AMBER_DIM, AMBER_DIM);
    gridHelper.position.y = -BOUNDS;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.06;
    scene.add(gridHelper);

    const axisColors = [0xf5a623, 0x00d4aa, 0xa78bfa];
    const axisEnds = [
      new THREE.Vector3(BOUNDS + 10, -BOUNDS, -BOUNDS),
      new THREE.Vector3(-BOUNDS, BOUNDS + 10, -BOUNDS),
      new THREE.Vector3(-BOUNDS, -BOUNDS, BOUNDS + 10),
    ];
    axisEnds.forEach((end, i) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-BOUNDS, -BOUNDS, -BOUNDS),
        end,
      ]);
      scene.add(
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: axisColors[i],
            transparent: true,
            opacity: 0.15,
          })
        )
      );
    });

    const gBest = new THREE.Vector3(15, 10, -8);
    const gBestGeo = new THREE.OctahedronGeometry(3, 0);
    const gBestMat = new THREE.MeshBasicMaterial({ color: AMBER, wireframe: true });
    const gBestMesh = new THREE.Mesh(gBestGeo, gBestMat);
    gBestMesh.position.copy(gBest);
    scene.add(gBestMesh);

    const glowRingGeo = new THREE.RingGeometry(5, 7, 32);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: AMBER,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.position.copy(gBest);
    scene.add(glowRing);

    interface SwarmParticle {
      pos: THREE.Vector3;
      start: THREE.Vector3;
      target: THREE.Vector3;
      phase: number;
      pBest: THREE.Vector3;
      trail: THREE.Vector3[];
      mesh: THREE.Mesh;
      trailLine: THREE.Line;
      trailAttr: THREE.BufferAttribute;
    }

    const numParticles = 12;
    const trailLength = 42;
    const particles: SwarmParticle[] = [];
    const particleGeo = new THREE.SphereGeometry(1.8, 12, 12);

    const randomDispersedPosition = () => {
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      return direction.multiplyScalar(BOUNDS * (0.95 + Math.random() * 0.45));
    };

    const randomTarget = () =>
      gBest.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        )
      );

    const createTrailGeometry = (pos: THREE.Vector3) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(trailLength * 3);
      for (let i = 0; i < trailLength; i++) {
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
      }
      const attr = new THREE.BufferAttribute(positions, 3);
      attr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", attr);
      return { geometry, attr };
    };

    for (let i = 0; i < numParticles; i++) {
      const start = randomDispersedPosition();
      const mesh = new THREE.Mesh(
        particleGeo,
        new THREE.MeshBasicMaterial({ color: AMBER })
      );
      mesh.position.copy(start);
      scene.add(mesh);

      const { geometry: trailGeo, attr: trailAttr } = createTrailGeometry(start);
      const trailLine = new THREE.Line(
        trailGeo,
        new THREE.LineBasicMaterial({
          color: AMBER,
          transparent: true,
          opacity: 0.25,
        })
      );
      scene.add(trailLine);

      particles.push({
        pos: start.clone(),
        start: start.clone(),
        target: randomTarget(),
        phase: Math.random() * Math.PI * 2,
        pBest: start.clone(),
        trail: Array.from({ length: trailLength }, () => start.clone()),
        mesh,
        trailLine,
        trailAttr,
      });
    }

    const resetParticle = (particle: SwarmParticle) => {
      particle.start.copy(randomDispersedPosition());
      particle.target.copy(randomTarget());
      particle.pos.copy(particle.start);
      particle.pBest.copy(particle.start);
      particle.phase = Math.random() * Math.PI * 2;
      particle.trail = Array.from({ length: trailLength }, () => particle.start.clone());
      for (let i = 0; i < trailLength; i++) {
        particle.trailAttr.setXYZ(i, particle.start.x, particle.start.y, particle.start.z);
      }
      particle.trailAttr.needsUpdate = true;
    };

    const onResize = () => {
      const width = container.clientWidth || 640;
      const height = container.clientHeight || 320;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId: number;
    let cycleTime = 0;
    const CYCLE_DURATION = 14;
    const HOLD_DURATION = 1.8;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      cycleTime += dt;

      if (cycleTime > CYCLE_DURATION + HOLD_DURATION) {
        cycleTime = 0;
        particles.forEach(resetParticle);
      }

      const rawProgress = Math.min(cycleTime / CYCLE_DURATION, 1);
      const progress = 1 - Math.pow(1 - rawProgress, 3);

      particles.forEach((particle) => {
        const orbitRadius = (1 - progress) * 10;
        const orbit = new THREE.Vector3(
          Math.sin(t * 1.4 + particle.phase) * orbitRadius,
          Math.cos(t * 1.1 + particle.phase) * orbitRadius * 0.7,
          Math.sin(t * 1.7 + particle.phase * 0.7) * orbitRadius
        );

        particle.pos.copy(particle.start).lerp(particle.target, progress).add(orbit);
        if (particle.pos.distanceTo(gBest) < particle.pBest.distanceTo(gBest)) {
          particle.pBest.copy(particle.pos);
        }

        particle.mesh.position.copy(particle.pos);
        const dist = particle.pos.distanceTo(gBest);
        const scale = 0.8 + Math.max(0, 1 - dist / 55) * 0.75;
        particle.mesh.scale.setScalar(scale);

        particle.trail.push(particle.pos.clone());
        if (particle.trail.length > trailLength) particle.trail.shift();
        particle.trail.forEach((point, index) => {
          particle.trailAttr.setXYZ(index, point.x, point.y, point.z);
        });
        particle.trailAttr.needsUpdate = true;
      });

      gBestMesh.rotation.y = t * 0.8;
      gBestMesh.rotation.x = t * 0.3;
      gBestMesh.scale.setScalar(1 + Math.sin(t * 3) * 0.2);
      glowRing.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.3;
      glowRing.rotation.z = t * 0.2;
      glowRing.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
      glowRingMat.opacity = 0.1 + Math.sin(t * 3) * 0.08;

      camera.position.x = Math.cos(t * 0.12) * 140;
      camera.position.z = Math.sin(t * 0.12) * 140;
      camera.position.y = 60 + Math.sin(t * 0.08) * 20;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      scene.traverse((object) => {
        if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) {
          object.geometry.dispose();
        }
        if ("material" in object) {
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else if (material instanceof THREE.Material) material.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
}
