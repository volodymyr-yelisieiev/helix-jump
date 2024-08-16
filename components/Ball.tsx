import React from 'react';
import {RigidBody} from '@react-three/rapier';

export default function Ball() {
    return (<RigidBody
        name="ball"
        colliders="ball"
        position={[0, 10, 7.5]}
        restitution={0}
        gravityScale={4}
    >
        <mesh>
            <sphereGeometry args={[1, 32, 32]}/>
            <meshPhysicalMaterial color="white"/>
        </mesh>
    </RigidBody>)
};
