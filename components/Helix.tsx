'use client';

import React, {useMemo} from 'react';
import {Cylinder} from '@react-three/drei';
import Platform from "@/components/Platform";

import {useAppContext} from "@/context/AppContext";
import {generateSectors} from "@/utils/geometryUtils";

export default function Helix({
                                  index,
                                  position = [0, 0, 0],
                                  platformRadius = 10,
                                  platformWidth = 1,
                                  platformColor = '#67c1f3',
                                  numPoints = 32,
                                  poleRadius = 5,
                                  poleColor = '#67c1f3',
                                  spaceBetween = 10,
                              }: {
    index: number;
    position?: [number, number, number];
    platformRadius?: number;
    platformWidth?: number;
    platformColor?: string;
    numPoints?: number;
    poleRadius?: number;
    poleColor?: string;
    spaceBetween?: number;
}) {
    const {rotation} = useAppContext();

    const sectorsList = useMemo(() => generateSectors(index), [index]);

    return (<group position={position}>
        <Cylinder
            args={[poleRadius, poleRadius, (platformWidth + spaceBetween) * 2, numPoints]}
            position={[0, (spaceBetween + platformWidth), 0]}
            rotation={rotation}
        >
            <meshPhysicalMaterial color={poleColor}/>
        </Cylinder>
        <Platform
            index={index}
            platformRadius={platformRadius}
            poleRadius={poleRadius}
            platformWidth={platformWidth}
            sectorsList={sectorsList}
            platformColor={platformColor}
            numPoints={numPoints}
            rotation={rotation}
        />
    </group>);
};