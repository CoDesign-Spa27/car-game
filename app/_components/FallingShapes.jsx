"use client"
import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const shapes = ['box', 'sphere', 'cone'];
const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

const FallingShape = ({ position }) => {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 0.5 + 0.5;
  const mass = Math.random() * 10 + 1;

  let geometry;
  switch (shape) {
    case 'box':
      geometry = <boxGeometry args={[size, size, size]} />;
      break;
    case 'sphere':
      geometry = <sphereGeometry args={[size / 2]} />;
      break;
    case 'cone':
      geometry = <coneGeometry args={[size / 2, size]} />;
      break;
  }

  return (
    <RigidBody position={position} mass={mass} name="fallingShape">
      <mesh castShadow>
        {geometry}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

const FallingShapes = () => {
  const [shapes, setShapes] = useState([]);

  useFrame(() => {
    if (Math.random() < 0.02) {
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      setShapes(prevShapes => [...prevShapes, { id: Date.now(), position: [x, 10, z] }]);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes(prevShapes => prevShapes.filter(shape => shape.position[1] > -10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return shapes.map(shape => <FallingShape key={shape.id} position={shape.position} />);
};

export default FallingShapes;