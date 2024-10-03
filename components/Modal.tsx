import React from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function Modal({ text }: any) {
  const { closeModal, score, resetGame } = useAppContext();

  return (
    <div className="fixed inset-0 flex items-end justify-center backdrop-blur-sm z-50">
      <div className="w-full">
        <div className="bg-[#0c2e4d] border-2 border-[#194e7e] rounded-t-3xl shadow-lg w-full flex flex-col p-6">
          <h2 className="text-2xl font-bold text-white">{text}</h2>
          <p className="text-xl font-semibold text-white mt-4">
            Your Score: {score}
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/">
              <button
                className="text-lg font-semibold bg-[#0c88f8] py-4 px-8 rounded-3xl transition duration-100 hover:bg-opacity-50 text-white"
                onClick={() => {
                  window.location.reload();
                  resetGame();
                }}
              >
                Try Again
              </button>
            </Link>
            <Link href="/">
              <button
                className="text-lg font-semibold bg-white bg-opacity-10 py-4 px-8 rounded-3xl transition duration-100 hover:bg-opacity-5 text-white"
                onClick={() => {
                  closeModal();
                  resetGame();
                }}
              >
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
