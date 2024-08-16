import React from 'react';
import Link from 'next/link';

import {useAppContext} from "@/context/AppContext";

export default function Modal({text}: { text: string }) {
    const {closeModal, score} = useAppContext();
    return (<div className="fixed inset-0 flex items-end justify-center backdrop-blur-md z-50">
        <div className="w-full max-w-lg">
            <div className="bg-[#0C2E4D] border-2 border-[#194E7E] p-8 rounded-[2rem] shadow-lg w-full m-4 space-y-4">
                <h2 className="text-2xl font-bold">{text}</h2>
                <p className="text-xl font-semibold">Your Score: {score}</p>
                <div className="flex space-x-4">
                    <button
                        className="text-lg font-semibold bg-[#0C88F8] px-8 py-4 rounded-2xl hover:bg-opacity-50 transition duration-100"
                        onClick={() => {
                            closeModal();
                            window.location.reload();
                        }}
                    >
                        Try Again
                    </button>
                    <Link href="/">
                        <button
                            className="text-lg font-semibold bg-white bg-opacity-10 px-8 py-4 rounded-2xl hover:bg-opacity-5 transition duration-100 text-up"
                            onClick={closeModal}
                        >
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </div>)
};