import { Suspense, useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { SoftShadows } from "@react-three/drei";
import Helix from "./Helix";
import Ball from "./Ball";
import CustomCamera from "./CustomCamera";

import { useAppContext } from "@/context/AppContext";

const range = 2;
const spaceBetween = 15;

export default function Scene() {
  const { isPaused, score } = useAppContext();

  const [helices, setHelices] = useState<
    { key: number; position: [number, number, number] }[]
  >([]);

  useEffect(() => {
    const newHelices = [];
    for (let i = score - range; i <= score + range; i++) {
      if (i >= 0) {
        const position: [number, number, number] = [0, -i * spaceBetween, 0];
        newHelices.push({
          key: i,
          position: position,
        });
      }
    }
    setHelices(newHelices);
  }, [score]);

  return (
    <Canvas
      camera={{
        position: [0, 10, 30],
        rotation: [-Math.PI / 6, 0, 0],
        fov: 60,
      }}
    >
      <CustomCamera />
      <ambientLight intensity={0.6} />
      <directionalLight intensity={0.6} position={[10, 20, 10]} />
      <Suspense>
        <Physics paused={isPaused}>
          {helices.map(({ key, position }) => {
            return (
              <Helix
                key={key}
                index={key}
                position={position}
                spaceBetween={spaceBetween}
              />
            );
          })}
          <Ball />
        </Physics>
      </Suspense>
      <SoftShadows />
    </Canvas>
  );
}
