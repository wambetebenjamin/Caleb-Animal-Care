"use client";

import { useEffect, useRef } from "react";

/**
 * Three.js floating paw-print particles in the hero (brief spec):
 * opacity 0.15, slow upward drift, stop & fade after 5s (no loop),
 * hidden on mobile, paused off-viewport, DPR ≤ 1.5.
 * Paw prints only — no decorative geometry.
 */
export function PawParticles() {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !holderRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
      camera.position.z = 8;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      holder.appendChild(renderer.domElement);

      // Paw texture drawn once on an offscreen canvas
      const cv = document.createElement("canvas");
      cv.width = 64;
      cv.height = 64;
      const ctx = cv.getContext("2d")!;
      ctx.fillStyle = "#00bd56";
      const toes: Array<[number, number, number]> = [
        [20, 22, 8],
        [32, 16, 8],
        [44, 22, 8],
      ];
      toes.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.beginPath();
      ctx.ellipse(32, 44, 13, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      const texture = new THREE.CanvasTexture(cv);

      const COUNT = 22;
      const sprites: Array<{ sprite: InstanceType<typeof THREE.Sprite>; speed: number; phase: number }> = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (let i = 0; i < COUNT; i++) {
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.15,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        const s = 0.28 + Math.random() * 0.3;
        sprite.scale.set(s, s, 1);
        sprite.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 2);
        scene.add(sprite);
        sprites.push({ sprite, speed: 0.16 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 });
      }

      function resize() {
        const w = holder!.clientWidth || 1;
        const h = holder!.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener("resize", resize);

      let raf = 0;
      let running = true;
      let last = performance.now();
      const bornAt = last;
      const LIFE_MS = 5000; // stop & fade after 5 seconds, do not loop
      const FADE_MS = 800;

      const io = new IntersectionObserver(
        ([entry]) => {
          running = entry.isIntersecting;
        },
        { threshold: 0.1 },
      );
      io.observe(holder);

      function tick(now: number) {
        raf = requestAnimationFrame(tick);
        if (!running) {
          last = now;
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const age = now - bornAt;
        const fade = age > LIFE_MS ? Math.max(0, 1 - (age - LIFE_MS) / FADE_MS) : 1;
        if (fade <= 0) {
          cleanup();
          return;
        }
        for (const p of sprites) {
          p.sprite.position.y += p.speed * dt;
          p.sprite.position.x += Math.sin(now / 1400 + p.phase) * 0.0018;
          if (p.sprite.position.y > 4.6) p.sprite.position.y = -4.6;
          const mat = p.sprite.material as InstanceType<typeof THREE.SpriteMaterial>;
          mat.opacity = 0.15 * fade;
        }
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);

      function cleanup() {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        scene.traverse((obj) => {
          const sprite = obj as unknown as { material?: { dispose(): void } };
          sprite.material?.dispose();
        });
        texture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      }
      dispose = cleanup;
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={holderRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block [&_canvas]:h-full [&_canvas]:w-full"
    />
  );
}
