import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Trail } from "@react-three/drei";
import { useAppContext } from "@/context/AppContext";

export default function Ball() {
  const { streak, ballRef } = useAppContext();
  return (
    <RigidBody
      name="ball"
      ref={ballRef}
      colliders="ball"
      collisionGroups={interactionGroups(1, 0)}
      sensor={true}
      position={[0, 10, 7.5]}
      mass={8}
      gravityScale={8}
      ccd
    >
      <Trail
        width={16}
        length={4}
        decay={0.5}
        attenuation={(width) => width * 0.75}
      >
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshLambertMaterial color={streak >= 3 ? "red" : "white"} />
        </mesh>

        <meshLineMaterial color={"white"} transparent={true} opacity={0.5} />
      </Trail>
    </RigidBody>
  );
}
