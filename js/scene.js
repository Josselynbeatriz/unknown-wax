/**
 * Fondo Three.js — partículas en óvalo (referencia al monograma UW)
 */

export function initHeroScene(canvas) {
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  import('https://unpkg.com/three@0.170.0/build/three.module.js')
    .then((THREE) => {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 14;

      const count = 420;
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = 3.2 + Math.random() * 4.8;
        const y = (Math.random() - 0.5) * 5;
        positions[i * 3] = Math.cos(t) * r * 1.35;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(t) * r * 0.55;
        speeds[i] = 0.15 + Math.random() * 0.45;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0x7a2e1d,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0x2a2a2d,
        transparent: true,
        opacity: 0.35,
      });

      function makeArc(y, scale) {
        const pts = [];
        for (let a = 0; a <= 64; a++) {
          const t = (a / 64) * Math.PI;
          pts.push(new THREE.Vector3(Math.cos(t) * 5.5 * scale, y, Math.sin(t) * 2.2 * scale));
        }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat);
      }

      scene.add(makeArc(1.2, 1));
      scene.add(makeArc(-1.2, 1));

      let mouseX = 0;
      let mouseY = 0;

      window.addEventListener(
        'pointermove',
        (e) => {
          mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
          mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35;
        },
        { passive: true }
      );

      function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      resize();
      window.addEventListener('resize', resize, { passive: true });

      let frame = 0;
      function animate() {
        frame += 0.004;
        points.rotation.y = frame * 0.15 + mouseX;
        points.rotation.x = mouseY * 0.25;
        camera.position.x = mouseX * 0.8;
        camera.position.y = -mouseY * 0.5;
        camera.lookAt(0, 0, 0);

        const pos = geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] += Math.sin(frame + i * 0.02) * 0.0008 * speeds[i];
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      animate();
    })
    .catch(() => {
      canvas.remove();
    });
}
