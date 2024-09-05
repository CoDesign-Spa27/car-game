"use client"
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

const Ground = ({ vehicleRef }) => {
  const groundRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (groundRef.current) {
      groundRef.current.setTranslation({ x: 0, y: -0.5, z: 0 });
    }
  }, []);

  useFrame(() => {
    if (vehicleRef.current && groundRef.current) {
      const vehicleZ = vehicleRef.current.translation().z;
      const groundZ = groundRef.current.translation().z;
 
      if (Math.abs(vehicleZ - groundZ) > 100) {
        groundRef.current.setTranslation({ x: 0, y: -0.5, z: vehicleZ });
      }

       
      camera.position.z = vehicleZ + 10;
    }
  });

  return (
    <RigidBody ref={groundRef} type="fixed" friction={1}>
      <CuboidCollider args={[100, 0.5, 1000]} position={[0, -0.5, 0]} />
      
      {/* Main road */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 2000]} />
        <meshStandardMaterial color="#808080" />
      </mesh>

      {/* Left grass */}
      <mesh receiveShadow position={[-15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 2000]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Right grass */}
      <mesh receiveShadow position={[15, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 2000]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Road markings */}
      <mesh receiveShadow position={[-5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 2000]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh receiveShadow position={[5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 2000]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </RigidBody>
  );
};

export default Ground;