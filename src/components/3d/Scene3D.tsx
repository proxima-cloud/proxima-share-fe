import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeStore } from '../../stores/useThemeStore';

const FloatingGeometry: React.FC<{ position: [number, number, number], geometry: 'sphere' | 'box' | 'torus' }> = ({ position, geometry }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useThemeStore();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[1]) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  const material = (
    <meshStandardMaterial
      color={theme === 'dark' ? '#3b82f6' : '#0ea5e9'}
      transparent
      opacity={0.6}
      roughness={0.3}
      metalness={0.7}
    />
  );

  const commonProps = {
    ref: meshRef,
    position,
    scale: 0.8,
  };

  switch (geometry) {
    case 'sphere':
      return <Sphere {...commonProps} args={[1, 32, 32]}>{material}</Sphere>;
    case 'box':
      return <Box {...commonProps} args={[1.5, 1.5, 1.5]}>{material}</Box>;
    case 'torus':
      return <Torus {...commonProps} args={[1, 0.4, 16, 32]}>{material}</Torus>;
    default:
      return null;
  }
};

export const Scene3D: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={theme === 'dark' ? 0.3 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={theme === 'dark' ? 0.8 : 1} />
        <pointLight position={[-10, -10, -10]} intensity={theme === 'dark' ? 0.3 : 0.5} color="#14b8a6" />
        
        <FloatingGeometry position={[-8, 3, -5]} geometry="sphere" />
        <FloatingGeometry position={[8, -2, -3]} geometry="box" />
        <FloatingGeometry position={[-6, -4, -7]} geometry="torus" />
        <FloatingGeometry position={[6, 4, -4]} geometry="sphere" />
        <FloatingGeometry position={[0, -6, -8]} geometry="box" />
        <FloatingGeometry position={[-3, 6, -6]} geometry="torus" />
      </Canvas>
    </div>
  );
};