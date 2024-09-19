import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { useAppContext } from "@/context/AppContext";

export default function CustomCamera() {
  const { ballRef } = useAppContext();
  const { camera } = useThree();
  const minBallY = useRef(15);

  useFrame(() => {
    const ballY = ballRef.current?.translation().y || 0;

    if (ballY < minBallY.current) {
      minBallY.current = ballY;
    }

    const targetY = 15 * (Math.floor(minBallY.current / 15) + 1);

    camera.position.y += (targetY - camera.position.y) * 0.1;
    camera.updateProjectionMatrix();
  });
  return null;
}
