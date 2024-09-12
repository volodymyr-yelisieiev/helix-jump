"use client";

import Modal from "@/components/Modal";
import Spinner from "@/components/Loader";

import { useAppContext } from "@/context/AppContext";
import dynamic from "next/dynamic";

import { MaterialNode } from "@react-three/fiber";
import { MeshLineMaterial } from "meshline";
import { extend } from "@react-three/fiber";

extend({ MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

const Scene = dynamic(() => import("./Scene"), {
  loading: () => <Spinner />,
  ssr: false,
});

export default function Game() {
  const { isModalOpen, modalText, score } = useAppContext();

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      {!isModalOpen && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 text-6xl font-bold z-10">
          {score}
        </div>
      )}
      <Scene />
      {isModalOpen && <Modal text={modalText} />}
    </div>
  );
}
