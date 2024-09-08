import { interactionGroups, RigidBody } from "@react-three/rapier";
import Sector from "./Sector";
import { useAppContext } from "@/context/AppContext";

export default function Platform({
  index,
  platformRadius = 10,
  poleRadius = 5,
  platformWidth = 1,
  sectorsList = [
    [0, Math.PI / 8, "loss"],
    [Math.PI / 8, (3 * Math.PI) / 8, "hole"],
    [(3 * Math.PI) / 8, Math.PI / 2, "loss"],
    [Math.PI / 2, Math.PI, "platform"],
    [Math.PI, (9 * Math.PI) / 8, "loss"],
    [(9 * Math.PI) / 8, (11 * Math.PI) / 8, "hole"],
    [(11 * Math.PI) / 8, (3 * Math.PI) / 2, "loss"],
    [(3 * Math.PI) / 2, 2 * Math.PI, "platform"],
  ],
  platformColor = "#67c1f3",
  lossColor = "#34adef",
  numPoints = 32,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  index: number;
  platformRadius?: number;
  poleRadius?: number;
  platformWidth?: number;
  sectorsList?: [number, number, "loss" | "platform" | "hole"][];
  platformColor?: string;
  lossColor?: string;
  numPoints?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const {
    openModal,
    preScore,
    setPreScore,
    score,
    setScore,
    numJumps,
    setNumJumps,
  } = useAppContext();

  const sectors = sectorsList.map(([startAngle, endAngle, type], i) => {
    const color =
      type === "loss"
        ? lossColor
        : type === "platform"
        ? platformColor
        : "transparent";
    const isVisible = type !== "hole";

    if (numJumps === 3) {
      openModal({ text: "You have jumped on the same platform 3 times!" });
    }

    return (
      <RigidBody
        key={i}
        colliders="trimesh"
        collisionGroups={interactionGroups(0, 1)}
        type={index >= score ? "fixed" : "dynamic"}
        sensor={!isVisible}
        includeInvisible={!isVisible}
        onIntersectionEnter={(other) => {
          if (index >= preScore && other.rigidBodyObject?.name === "ball") {
            if (type === "platform") {
              other.rigidBody?.setLinvel({ x: 0, y: 48, z: 0 }, true);
              if (index !== 0) {
                setNumJumps(numJumps + 1);
              }
            }
            if (type === "loss") {
              openModal({ text: "You have touched the Loss Sector!" });
            }
            if (type === "hole") {
              setPreScore(preScore + 1);
              setNumJumps(0);
            }
          }
        }}
        onIntersectionExit={(other) => {
          if (index >= score && other.rigidBodyObject?.name === "ball") {
            if (type === "hole") {
              setScore(score + 1);
            }
          }
        }}
        position={position}
        rotation={index >= score ? rotation : [0, 0, 0]}
      >
        <Sector
          platformRadius={platformRadius}
          poleRadius={poleRadius}
          platformWidth={platformWidth}
          startAngle={startAngle}
          endAngle={endAngle}
          isVisible={isVisible}
          color={color}
          numPoints={numPoints}
        />
      </RigidBody>
    );
  });

  return <>{sectors}</>;
}
