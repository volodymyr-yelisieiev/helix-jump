import { createSectorGeometry } from "@/utils/geometry_utils";

export default function Sector({
  platformRadius,
  platformWidth,
  startAngle,
  endAngle,
  isVisible,
  color,
  numPoints,
}: {
  platformRadius: number;
  poleRadius: number;
  platformWidth: number;
  startAngle: number;
  endAngle: number;
  isVisible: boolean;
  color: string;
  numPoints: number;
}) {
  return (
    <mesh
      geometry={createSectorGeometry(
        platformRadius,
        platformWidth,
        startAngle,
        endAngle,
        numPoints
      )}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={isVisible}
    >
      <meshLambertMaterial color={color} />
    </mesh>
  );
}
