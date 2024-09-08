import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { useAppContext } from "@/context/AppContext";

export default function CustomCamera() {
  const { score } = useAppContext();
  const { camera } = useThree();
  const targetY = useRef(10);

  useFrame(() => {
    targetY.current = 15 - 15 * score;
    camera.position.y += (targetY.current - camera.position.y) * 0.1;
    camera.updateProjectionMatrix();
  });
  return null;
}
