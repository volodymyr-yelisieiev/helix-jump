'use client'

import {ReactNode, Suspense, useCallback, useEffect, useState} from "react";
import {AppProvider} from '@/context/AppContext';
import Spinner from "@/components/Spinner";

export default function HomeLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [modalText, setModalText] = useState<string>("");

    const openModal = ({text = "You Lost!"}: { text: string }) => {
        setModalText(text)
        setIsPaused(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsPaused(false);
        setIsModalOpen(false);
    };

    const [preScore, setPreScore] = useState<number>(0);

    const [score, setScore] = useState<number>(0);

    const [numJumps, setNumJumps] = useState<number>(0);

    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (event.buttons === 1 && !isModalOpen) {
            const deltaX = event.movementX;
            setRotation(prev => [prev[0], prev[1] + deltaX * 0.01, prev[2]]);
        }
    }, [isModalOpen]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return (<AppProvider isModalOpen={isModalOpen} isPaused={isPaused} modalText={modalText} setModalText={setModalText}
                         openModal={openModal} closeModal={closeModal}
                         preScore={preScore} setPreScore={setPreScore} score={score} setScore={setScore}
                         numJumps={numJumps} setNumJumps={setNumJumps} rotation={rotation}>
        <Suspense fallback={<Spinner/>}>
            {children}
        </Suspense>
    </AppProvider>)
}
