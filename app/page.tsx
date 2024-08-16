import Link from 'next/link'

export default function Home() {
    return (<div className="flex flex-col items-center justify-center w-screen max-w-screen-lg h-screen">
        <h1 className="text-4xl font-bold mb-8">Helix Jump</h1>
        <Link href={"/game"}>
            <button
                className="text-2xl font-bold bg-white text-black px-8 py-4 rounded-2xl hover:bg-gray-200 transition duration-100">
                Play Game
            </button>
        </Link>
    </div>)
}
