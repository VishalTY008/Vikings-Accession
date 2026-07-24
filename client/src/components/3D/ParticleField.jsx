import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useDeviceCapabilities from '../../hooks/useDeviceCapabilities';

function Particles({ count, colors }) {
  const meshRef = useRef();

  const { positions, particleColors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const spds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;

      spds[i] = 0.002 + Math.random() * 0.008;
    }

    return { positions: pos, particleColors: cols, speeds: spds };
  }, [count, colors]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += speeds[i];
      posAttr.array[i * 3] += Math.sin(time * 0.5 + i) * 0.001;

      if (posAttr.array[i * 3 + 1] > 6) {
        posAttr.array[i * 3 + 1] = -6;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const { particleCount, isMobile } = useDeviceCapabilities();
  const count = isMobile ? Math.min(particleCount, 150) : particleCount;

  const colors = ['#6366F1', '#818CF8', '#06B6D4', '#22D3EE', '#22C55E'];

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none" style={{ opacity: 0.7 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1]}
        frameloop="always"
      >
        <Particles count={count} colors={colors} />
      </Canvas>
    </div>
  );
}
