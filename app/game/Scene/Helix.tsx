import { useEffect, useMemo, useRef, useState } from "react";
import { Cylinder } from "@react-three/drei";

import { useAppContext } from "@/context/AppContext";
import { generateSectors } from "@/utils/geometry_utils";
import { createSectorGeometry } from "@/utils/geometry_utils";

import {
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

const platformRadius = 10;
const platformWidth = 1;
const platformColor = "#67c1f3";
const lossColor = "#34adef";
const poleRadius = 5;
const poleColor = "#67c1f3";
const numPoints = 32;

export default function Helix({
  index,
  position,
  spaceBetween,
}: {
  index: number;
  position: [number, number, number];
  spaceBetween: number;
}) {
  const {
    openModal,
    preScore,
    setPreScore,
    score,
    setScore,
    numJumps,
    setNumJumps,
    rotation,
  } = useAppContext();

  const sectorsList = useMemo(() => generateSectors(index), [index]);

  const sectors = sectorsList.map(([startAngle, endAngle, type], i) => {
    const rigidBody = useRef<RapierRigidBody>(null);
    const impulseApplied = useRef(false);

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

    const [currentRotation, setCurrentRotation] = useState<
      [number, number, number]
    >([0, 0, 0]);

    useFrame(() => {
      if (index >= score) {
        setCurrentRotation(rotation);
      }
    });

    useEffect(() => {
      if (index < score && !impulseApplied.current) {
        rigidBody.current?.setLinvel(
          {
            x: Math.cos((startAngle + endAngle) / 2 + currentRotation[1]) * 25,
            y: 0,
            z: -Math.sin((startAngle + endAngle) / 2 + currentRotation[1]) * 25,
          },
          true
        );
        impulseApplied.current = true;
      }
    }, [score]);

    return (
      <RigidBody
        key={i}
        ref={rigidBody}
        name="sector"
        colliders="trimesh"
        collisionGroups={interactionGroups(0, 1)}
        type={index >= score ? "fixed" : "dynamic"}
        mass={8}
        gravityScale={8}
        includeInvisible={true}
        onIntersectionEnter={(other) => {
          if (index >= preScore && other.rigidBodyObject?.name === "ball") {
            if (type === "platform") {
              other.rigidBody?.setLinvel({ x: 0, y: 32, z: 0 }, true);
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
        rotation={currentRotation}
      >
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
      </RigidBody>
    );
  });

  return (
    <group position={position}>
      <Cylinder
        args={[poleRadius, poleRadius, platformWidth + spaceBetween, numPoints]}
        position={[0, spaceBetween + platformWidth, 0]}
        rotation={rotation}
      >
        <meshLambertMaterial color={poleColor} />
      </Cylinder>
      <>{sectors}</>
    </group>
  );
}
