import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vUv = uv;
    vec3 newPosition = position;
    float displacement = sin(position.x * 0.3 + time) *
                         sin(position.y * 0.2 + time) *
                         sin(position.z * 0.1 + time) * 0.5;

    vDisplacement = displacement;
    newPosition += normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color;
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    float intensity = vDisplacement * 2.0 + 0.5;
    vec3 glowColor = color * intensity;
    float alpha = 0.3 + abs(vDisplacement) * 0.5;

    // Grid effect
    float gridX = mod(vUv.x * 50.0, 1.0);
    float gridY = mod(vUv.y * 50.0, 1.0);
    float grid = (gridX < 0.05 || gridY < 0.05) ? 0.2 : 0.0;

    gl_FragColor = vec4(glowColor + grid, alpha);
  }
`;

// Wireframe torus with a shader-driven wave displacement, slowly rotating.
const KusamaTorus = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // WebGL unavailable — the static background layers still render
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 20;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color("#ff0066") },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe: true,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Fade out over the first ~60% of a viewport of scrolling
    let visible = true;
    const handleScroll = () => {
      const opacity = Math.max(
        0,
        1 - window.scrollY / (window.innerHeight * 0.6),
      );
      container.style.opacity = String(opacity);
      visible = opacity > 0;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frameId = 0;
    const animate = () => {
      // Skip GPU work while scrolled out of view
      if (visible) {
        material.uniforms.time.value += 0.01;
        torus.rotation.x += 0.001;
        torus.rotation.y += 0.002;
        renderer.render(scene, camera);
      }
      frameId = requestAnimationFrame(animate);
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 transition-opacity duration-150"
    />
  );
};

export default KusamaTorus;
