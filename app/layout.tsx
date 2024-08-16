import '@/public/styles/globals.css'
import {ReactNode} from 'react'

import {Rubik} from 'next/font/google';

const rubik = Rubik({subsets: ['latin']})
export const metadata = {
    title: 'Helix Jump', description: 'A simple Helix Jump game clone',
}

export default function HomeLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (<html lang="en" className={`${rubik.className} size-full bg-[#0C88F8] text-white`}>
    <body className="size-full flex justify-center items-center">{children}</body>
    </html>)
}
