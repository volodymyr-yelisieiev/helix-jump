import React, { memo, useMemo } from "react";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Trail } from "@react-three/drei";
import { useAppContext } from "@/context/AppContext";
import * as THREE from "three";

function Ball() {
  const { streak, ballRef } = useAppContext();

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);

  const material = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        color: streak >= 3 ? "red" : "white",
      }),
    [streak]
  );

  const trailMaterialProps = useMemo(
    () => ({
      color: "white",
      transparent: true,
      opacity: 0.5,
    }),
    []
  );

  const attenuationFunction = useMemo(
    () => (width: number) => width * 0.75,
    []
  );

  return (
    <RigidBody
      name="ball"
      ref={ballRef}
      colliders="ball"
      collisionGroups={interactionGroups(1, 0)}
      sensor
      position={[0, 10, 7.5]}
      mass={8}
      gravityScale={8}
      ccd
      type="dynamic"
    >
      <Trail
        width={16}
        length={4}
        decay={0.5}
        attenuation={attenuationFunction}
      >
        <mesh geometry={geometry} material={material} />
        <meshLineMaterial {...trailMaterialProps} />
      </Trail>
    </RigidBody>
  );
}

export default memo(Ball);
