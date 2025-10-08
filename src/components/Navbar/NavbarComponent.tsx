"use client"

import Link from "next/link"
import { IoLogInOutline, IoPaperPlane, IoLogOutOutline } from "react-icons/io5"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function NavbarComponent() {
    const { data: session, status } = useSession()

    return (
        <header className={`${!session ? "fixed" : "sticky"} top-0 left-0 w-full bg-white shadow z-50`}>
            <nav className="flex flex-row items-center justify-between px-2 md:px-6 py-3 z-50">
                <div className="flex flex-row items-center gap-2">
                    <Image src="/itlogo.png" alt="Logo IT" width={40} height={40} />
                    <Link href="/" className="tracking-wider hover:text-violet-500 duration-300 flex flex-col">
                        <h1 className="text-2xl font-bold">KPRS</h1>
                        <span className="text-md -mt-2 tracking-[8px] font-bold">2026</span>
                    </Link>
                </div>

                <ul className="flex flex-row items-center gap-2">
                    {status === "loading" ? null : status === "unauthenticated" ? (
                        <>
                            <li>
                                <Link
                                    href="/register"
                                    className="flex flex-row items-center gap-1 hover:bg-violet-500 hover:text-white bg-violet-50 border text-violet-600 duration-300 px-3 py-2 rounded-xl"
                                >
                                    <IoPaperPlane size={20} />
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm md:text-base flex flex-row items-center gap-1 hover:bg-violet-500 hover:text-white bg-violet-50 border text-violet-600 duration-300 px-3 py-2 rounded-xl"
                                >
                                    <IoLogInOutline size={24} />
                                    Log In
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center gap-2 text-red-600 cursor-pointer"
                            >
                                <IoLogOutOutline size={28} />
                                <span>Logout</span>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}
