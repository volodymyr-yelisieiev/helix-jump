'use client'

import React, {useEffect, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Physics} from '@react-three/rapier';
import {SoftShadows} from '@react-three/drei';
import Helix from '@/components/Helix';
import Ball from '@/components/Ball';
import Modal from '@/components/Modal';
import CustomCamera from "@/components/CustomCamera";
import {useAppContext} from "@/context/AppContext";


export default function Game() {

    const {isModalOpen, isPaused, modalText, score} = useAppContext();

    const [helices, setHelices] = useState<{ key: number; position: [number, number, number] }[]>([]);

    const spaceBetween = 10;
    const range = 3;


    // Update helices based on score
    useEffect(() => {
        const newHelices = [];
        for (let i = score; i <= score + range; i++) {
            newHelices.push({
                key: i, position: [0, -i * spaceBetween, 0] as [number, number, number],
            });
        }
        setHelices(newHelices);
    }, [score]);

    return (<div className="flex flex-col items-center justify-center w-screen max-w-screen-lg h-screen">
        <Canvas
            className="size-full"
            camera={{position: [0, 10, 30], rotation: [-Math.PI / 8, 0, 0], fov: 60}}
        >
            <CustomCamera/>

            <ambientLight intensity={0.5}/>
            <spotLight
                castShadow
                angle={Math.PI / 6}
                intensity={1}
                position={[-10, 10, -10]}
            />
            <directionalLight
                castShadow
                intensity={0.5}
                position={[10, 20, 10]}
            />
            <Physics paused={isPaused}>
                {helices.map(({key, position}) => {
                    return (<Helix
                        key={key}
                        index={key}
                        position={position}
                    />)
                })}
                <Ball/>
            </Physics>
            <SoftShadows/>
        </Canvas>
        {!isModalOpen && <div className="fixed top-12 left-1/2 transform -translate-x-1/2 text-6xl font-bold z-10">
            {score}
        </div>}
        {isModalOpen && <Modal text={modalText}/>}
    </div>);
}