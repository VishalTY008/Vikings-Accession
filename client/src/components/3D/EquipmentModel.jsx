import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Dumbbell({ position = [0, 0, 0], rotationSpeed = 0.005 }) {
  const groupRef = useRef();

  const handleRadius = 0.18;
  const handleLength = 1.2;
  const plateRadius = 0.45;
  const plateThickness = 0.12;

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2a2a',
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.2,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6366F1',
    metalness: 0.7,
    roughness: 0.2,
    emissive: '#6366F1',
    emissiveIntensity: 0.1,
  }), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh material={metalMaterial}>
        <cylinderGeometry args={[handleRadius, handleRadius, handleLength, 16]} />
      </mesh>
      {[1, -1].map((dir) => (
        <group key={dir} position={[0, dir * (handleLength / 2 + plateThickness / 2), 0]}>
          <mesh material={accentMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[plateRadius, plateRadius, plateThickness, 24]} />
          </mesh>
          <mesh material={metalMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, dir * 0.02, 0]}>
            <torusGeometry args={[plateRadius - 0.02, 0.015, 8, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Barbell({ position = [0, 0, 0], rotationSpeed = 0.003 }) {
  const groupRef = useRef();

  const barRadius = 0.04;
  const barLength = 2.8;
  const plateRadius = 0.55;
  const plateThickness = 0.08;

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#888888',
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), []);

  const plateMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.8,
    roughness: 0.3,
  }), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, Math.PI * 0.05]}>
      <mesh material={metalMaterial} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[barRadius, barRadius, barLength, 12]} />
      </mesh>
      {[1, -1].map((dir) => (
        <group key={dir} position={[dir * (barLength / 2 - 0.3), 0, 0]}>
          {[1, 0.75, 0.5].map((scale, i) => (
            <mesh key={i} material={plateMaterial} rotation={[0, 0, Math.PI / 2]}
              position={[dir * (i * plateThickness + 0.05), 0, 0]}>
              <cylinderGeometry args={[plateRadius * scale, plateRadius * scale, plateThickness, 20]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Kettlebell({ position = [0, 0, 0], rotationSpeed = 0.004 }) {
  const groupRef = useRef();

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.85,
    roughness: 0.2,
    envMapIntensity: 1.0,
  }), []);

  const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#555555',
    metalness: 0.9,
    roughness: 0.15,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#06B6D4',
    emissiveIntensity: 0.1,
  }), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.0012 + 1) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh material={bodyMaterial}>
        <sphereGeometry args={[0.4, 24, 24]} />
      </mesh>
      <mesh material={accentMaterial} position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.06, 24]} />
      </mesh>
      <mesh material={handleMaterial} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.22, 0.04, 12, 24, Math.PI]} />
      </mesh>
      <mesh material={accentMaterial} position={[0, 0.28, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.02]} />
      </mesh>
    </group>
  );
}

export default function EquipmentModel({ type = 'dumbbell', ...props }) {
  switch (type) {
    case 'barbell':
      return <Barbell {...props} />;
    case 'kettlebell':
      return <Kettlebell {...props} />;
    default:
      return <Dumbbell {...props} />;
  }
}
