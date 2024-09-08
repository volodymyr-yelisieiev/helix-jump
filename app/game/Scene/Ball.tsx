import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Trail } from "@react-three/drei";

export default function Ball() {
  return (
    <RigidBody
      name="ball"
      colliders="ball"
      collisionGroups={interactionGroups(1, 0)}
      sensor={true}
      position={[0, 10, 7.5]}
      mass={16}
      gravityScale={16}
    >
      <Trail
        width={16}
        color="white"
        length={8}
        decay={0.5}
        local={false}
        stride={0}
        interval={1}
        attenuation={(width) => width * 0.75}
      >
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshLambertMaterial color="white" />
        </mesh>
      </Trail>
    </RigidBody>
  );
}
