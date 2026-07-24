import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useDeviceCapabilities from '../../hooks/useDeviceCapabilities';

export default function SmokeEffect() {
  const { isMobile, quality } = useDeviceCapabilities();
  const groupRef = useRef();

  const planes = useMemo(() => {
    return Array.from({ length: isMobile ? 2 : 4 }, (_, i) => ({
      key: i,
      position: [(Math.random() - 0.5) * 4, -2 + Math.random() * 2, -2 - i * 0.5],
      scale: 3 + Math.random() * 2,
      speed: 0.0003 + Math.random() * 0.0005,
      opacity: 0.03 + Math.random() * 0.02,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [isMobile]);

  const smokeMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.04 },
      uColor: { value: new THREE.Color('#6366F1') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        float n = noise(uv * 3.0 + uTime * 0.1);
        float edge = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x)
                   * smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
        float alpha = n * edge * uOpacity;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    smokeMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  if (quality === 'low') return null;

  return (
    <group ref={groupRef}>
      {planes.map((p) => (
        <mesh key={p.key} position={p.position} material={smokeMaterial}>
          <planeGeometry args={[p.scale, p.scale]} />
        </mesh>
      ))}
    </group>
  );
}
