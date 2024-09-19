"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AppProvider } from "@/context/AppContext";
import { RapierRigidBody } from "@react-three/rapier";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("");

  const openModal = ({ text = "You Lost!" }: { text: string }) => {
    setModalText(text);
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
  const [streak, setStreak] = useState<number>(0);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const ballRef = useRef<RapierRigidBody>(null);

  const previousTouchXRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1 && !isModalOpen) {
        const deltaX = event.movementX;
        setRotation((prev) => [prev[0], prev[1] + deltaX * 0.01, prev[2]]);
      }
    },
    [isModalOpen]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isModalOpen && event.touches.length === 1) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - previousTouchXRef.current;
        previousTouchXRef.current = touch.clientX;

        setRotation((prev) => [prev[0], prev[1] + deltaX * 0.01, prev[2]]);
      }
    },
    [isModalOpen]
  );

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      previousTouchXRef.current = event.touches[0].clientX;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleMouseMove, handleTouchMove, handleTouchStart]);

  return (
    <AppProvider
      isModalOpen={isModalOpen}
      isPaused={isPaused}
      modalText={modalText}
      setModalText={setModalText}
      openModal={openModal}
      closeModal={closeModal}
      preScore={preScore}
      setPreScore={setPreScore}
      score={score}
      setScore={setScore}
      numJumps={numJumps}
      setNumJumps={setNumJumps}
      streak={streak}
      setStreak={setStreak}
      rotation={rotation}
      ballRef={ballRef}
    >
      {children}
    </AppProvider>
  );
}
