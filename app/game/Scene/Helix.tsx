import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Cylinder } from "@react-three/drei";
import { useAppContext } from "@/context/AppContext";
import { generateSectors, createSectorGeometry } from "@/utils/geometry_utils";
import {
  CollisionTarget,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

const platformRadius = 10;
const platformWidth = 2;
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
  const { openModal, numJumps, rotation } = useAppContext();

  const sectorsList = useMemo(
    () =>
      generateSectors(index, {
        platform: {
          minSize: Math.PI / 4,
          maxSize: Math.PI / 2,
          minCount: 1,
          maxCount: 3,
        },
        loss: {
          minSize: Math.PI / 16,
          maxSize: Math.PI / 4,
          minCount: 1,
          maxCount: 2,
        },
        hole: {
          minSize: Math.PI / 6,
          maxSize: Math.PI / 4,
          minCount: 1,
          maxCount: 2,
        },
      }),
    [index]
  );

  useEffect(() => {
    if (numJumps === 5) {
      openModal({ text: "You have jumped on the same platform 5 times!" });
    }
  }, [numJumps, openModal]);

  return (
    <group position={position}>
      <Cylinder
        args={[poleRadius, poleRadius, platformWidth + spaceBetween, numPoints]}
        position={[0, spaceBetween + platformWidth, 0]}
        rotation={rotation}
      >
        <meshLambertMaterial color={poleColor} />
      </Cylinder>
      {sectorsList.map(([startAngle, endAngle, type], i) => (
        <Sector
          key={i}
          index={index}
          startAngle={startAngle}
          endAngle={endAngle}
          type={type}
        />
      ))}
    </group>
  );
}

function Sector({
  index,
  startAngle,
  endAngle,
  type,
}: {
  index: number;
  startAngle: number;
  endAngle: number;
  type: string;
}) {
  const {
    openModal,
    preScore,
    setPreScore,
    score,
    setScore,
    numJumps,
    setNumJumps,
    streak,
    setStreak,
    rotation,
  } = useAppContext();

  const sectorRef = useRef<RapierRigidBody>(null);
  const impulseApplied = useRef(false);
  const [currentRotation, setCurrentRotation] = useState<
    [number, number, number]
  >([0, 0, 0]);

  const color =
    type === "loss"
      ? lossColor
      : type === "platform"
      ? platformColor
      : "transparent";
  const isVisible = type !== "hole";

  useFrame(() => {
    if (index >= score) {
      setCurrentRotation(rotation);
    }
  });

  useEffect(() => {
    if (index < score && !impulseApplied.current) {
      sectorRef.current?.setLinvel(
        {
          x: Math.cos((startAngle + endAngle) / 2 + currentRotation[1]) * 25,
          y: 0,
          z: -Math.sin((startAngle + endAngle) / 2 + currentRotation[1]) * 25,
        },
        true
      );
      impulseApplied.current = true;
    }
  }, [score, index, startAngle, endAngle, currentRotation]);

  const handleIntersectionEnter = useCallback(
    (other: CollisionTarget) => {
      if (index >= score && other.rigidBodyObject?.name === "ball") {
        if (type === "platform") {
          other.rigidBody?.setLinvel({ x: 0, y: 32, z: 0 }, true);
          if (index !== 0) setNumJumps(numJumps + 1);
          if (streak >= 3) {
            setScore(score + 1);
          }
          setStreak(0);
        } else if (type === "loss") {
          if (streak >= 3) {
            other.rigidBody?.setLinvel({ x: 0, y: 32, z: 0 }, true);
            setNumJumps(numJumps + 1);
            setScore(score + 1);
            setStreak(0);
          } else openModal({ text: "You have touched the Loss Sector!" });
        } else if (type === "hole") {
          if (streak === 0 || numJumps === 0) {
            setStreak(streak + 1);
          }
          setScore(score + 1);
          setNumJumps(0);
        }
      }
    },
    [index, preScore, setPreScore, numJumps, setNumJumps, openModal]
  );

  return (
    <RigidBody
      ref={sectorRef}
      name="sector"
      colliders="trimesh"
      collisionGroups={interactionGroups(0, 1)}
      type={index >= score ? "fixed" : "dynamic"}
      mass={8}
      scale={type === "hole" ? [1, 0.1, 1] : 1}
      gravityScale={8}
      includeInvisible={true}
      onIntersectionEnter={handleIntersectionEnter}
      rotation={currentRotation}
      ccd
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
}
