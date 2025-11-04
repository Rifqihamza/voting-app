"use client"

import Link from "next/link"
import { IoLogInOutline, IoPaperPlane } from "react-icons/io5"
import Image from "next/image"

export default function NavbarComponent() {

    return (
        <header className="fixed top-4 left-0 right-0 w-full max-w-7xl mx-auto bg-white rounded-2xl shadow z-50">
            <nav className="flex flex-row items-center justify-between px-2 md:px-6 py-2 z-50">
                <div className="flex flex-row items-center gap-3">
                    <Image src="/Image/itlogo.png" alt="Logo IT" width={35} height={35} />
                    <Link href="/" className="tracking-wider hover:text-violet-500 duration-300 flex flex-col">
                        <h1 className="text-xl font-bold">KPRS</h1>
                        <span className="text-sm -mt-2 tracking-[6px] font-bold">2026</span>
                    </Link>
                </div>

                <ul className="flex flex-row items-center gap-2">
                    <>
                        <li>
                            <Link
                                href="/AuthPage/register"
                                className="text-sm md:text-base flex flex-row items-center justify-center gap-1 hover:bg-violet-500 hover:text-white bg-violet-50 border text-violet-600 duration-300 px-2 py-1.5 rounded-xl"
                            >
                                <IoPaperPlane size={16} />
                                <span>
                                    Register
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/AuthPage/login"
                                className="text-sm md:text-base flex flex-row items-center justify-center gap-1 hover:bg-violet-500 hover:text-white bg-violet-50 border text-violet-600 duration-300 px-2 py-1.5 rounded-xl"
                            >
                                <IoLogInOutline size={22} />
                                <span>
                                    Log In
                                </span>
                            </Link>
                        </li>
                    </>

                </ul>
            </nav>
        </header>
    )
}
