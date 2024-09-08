import { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { SoftShadows } from "@react-three/drei";
import Helix from "./Helix";
import Ball from "./Ball";
import CustomCamera from "./CustomCamera";

import { useAppContext } from "@/context/AppContext";

const spaceBetween = 15;
const range = 2;

export default function Scene() {
  const { isPaused, score } = useAppContext();

  const [helices, setHelices] = useState<
    { key: number; position: [number, number, number] }[]
  >([]);

  useEffect(() => {
    const newHelices = [];
    for (let i = score - range; i <= score + range; i++) {
      if (i >= 0) {
        newHelices.push({
          key: i,
          position: [0, -i * spaceBetween, 0] as [number, number, number],
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
      <ambientLight intensity={0.5} />
      <spotLight
        castShadow
        angle={Math.PI / 6}
        intensity={1}
        position={[-10, 10, -10]}
      />
      <directionalLight castShadow intensity={0.5} position={[10, 20, 10]} />
      <Physics paused={isPaused} debug>
        {helices.map(({ key, position }) => {
          return <Helix key={key} index={key} position={position} />;
        })}
        <Ball />
      </Physics>
      <SoftShadows />
    </Canvas>
  );
}
