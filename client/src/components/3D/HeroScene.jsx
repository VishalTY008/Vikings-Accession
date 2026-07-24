import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import EquipmentModel from './EquipmentModel';
import useDeviceCapabilities from '../../hooks/useDeviceCapabilities';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={0.6} color="#6366F1" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={0.4} color="#06B6D4" distance={8} />
      <spotLight position={[0, 8, 0]} intensity={0.3} angle={0.6} penumbra={1} color="#ffffff" />
    </>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.1) * 0.2;
    camera.position.y = Math.cos(t * 0.15) * 0.15;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({ quality }) {
  return (
    <>
      <Lights />
      <MouseParallax />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <EquipmentModel type="dumbbell" position={[0, 0, 0]} rotationSpeed={0.008} />
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <EquipmentModel type="barbell" position={[-2.5, -0.3, -1]} rotationSpeed={0.004} />
      </Float>

      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.4}>
        <EquipmentModel type="kettlebell" position={[2.5, 0.2, -0.5]} rotationSpeed={0.006} />
      </Float>

      <Environment preset="city" />

      {quality !== 'low' && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
            intensity={0.4}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene() {
  const { quality, isMobile } = useDeviceCapabilities();

  return (
    <div className="three-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop="demand"
        style={{ pointerEvents: 'none' }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <Scene quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
