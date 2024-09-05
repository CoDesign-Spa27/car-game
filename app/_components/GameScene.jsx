"use client";

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, OrbitControls, KeyboardControls } from '@react-three/drei';
import Vehicle from '../_components/Vehicle';
import FallingShapes from '../_components/FallingShapes';
import Ground from '../_components/Ground';
import Tutorial from './Tutorial';

const controls = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
];

export default function Game() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const vehicleRef = useRef();

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    console.log(finalScore);
    alert("Game Over");
    setGameOver(true);
  };

  return (
    <KeyboardControls map={controls}>
      <div className="w-full h-screen relative">
        {/* Tutorial box in the top-left corner */}
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
        width:'60%',
          zIndex: 10, // Ensure it's on top of other elements
        }}>
          <Tutorial />
        </div>

        <Canvas shadows>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={1} />
          <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
          <Physics>
            <Suspense fallback={null}>
              <Vehicle ref={vehicleRef} onCollision={handleGameOver} />
              <FallingShapes />
              <Ground vehicleRef={vehicleRef} />
            </Suspense>
          </Physics>
          <OrbitControls />
        </Canvas>

        {/* Game over logic can go here */}
        {/* {gameOver && <GameOverModal score={score} />} */}
      </div>
    </KeyboardControls>
  );
}
