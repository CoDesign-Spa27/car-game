"use client"
import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';

const Vehicle = React.forwardRef(({ onCollision }, ref) => {
  const { camera } = useThree();
  const { world } = useRapier();
  const [, getKeys] = useKeyboardControls();
  const vehicleRef = ref || useRef(null);

  useEffect(() => {
 
    if (vehicleRef.current) {
      vehicleRef.current.setTranslation({ x: 0, y: 0.5, z: 0 });
      vehicleRef.current.setRotation({ x: 0, y: 0, z: 0 });
    }

    const checkCollision = () => {
      const vehicleBody = vehicleRef.current?.raw();
      if (vehicleBody) {
        world.intersectionPairsWith(vehicleBody, (otherCollider) => {
          if (otherCollider.parent()?.name === 'fallingShape') {
            onCollision();
          }
        });
      }
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [world, onCollision, vehicleRef]);

  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    const { forward, backward, left, right } = getKeys();
    
    const speed = 10;
    const rotationSpeed = 3;

    const vehicleBody = vehicleRef.current;
    const vehiclePosition = vehicleBody.translation();
    const vehicleRotation = vehicleBody.rotation();

    const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(vehicleRotation);

    if (forward) {
      vehiclePosition.x += direction.x * speed * delta;
      vehiclePosition.z += direction.z * speed * delta;
    }
    if (backward) {
      vehiclePosition.x -= direction.x * speed * delta;
      vehiclePosition.z -= direction.z * speed * delta;
    }
    if (left) {
      vehicleRotation.y += rotationSpeed * delta;
    }
    if (right) {
      vehicleRotation.y -= rotationSpeed * delta;
    }

    vehicleBody.setTranslation(vehiclePosition);
    vehicleBody.setRotation(vehicleRotation);

    // Update camera position
    camera.position.x = vehiclePosition.x;
    camera.position.y = vehiclePosition.y + 5;
    camera.position.z = vehiclePosition.z + 10;
    camera.lookAt(vehiclePosition.x, vehiclePosition.y, vehiclePosition.z);


    
  });

  return (
    <RigidBody ref={vehicleRef} colliders="hull" mass={1} type="dynamic" name="vehicle">
      {/* Vehicle Body */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      
      {/* Front Wheel (Sphere) */}
      <mesh castShadow position={[0, -0.25, 0.6]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Back Wheels (Cylinders) */}
      <mesh castShadow position={[-0.7, -0.25, -0.5]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh castShadow position={[0.7, -0.25, -0.5]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </RigidBody>
  );
});

export default Vehicle;
