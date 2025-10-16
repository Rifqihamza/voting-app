"use client"

import { signOut } from "next-auth/react"
import { BiLogOut } from "react-icons/bi"

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/" })
    }

    return (
        <button
            onClick={handleLogout}
            className="text-md uppercase tracking-widest flex items-center font-semibold text-red-500 hover:text-red-200 duration-300 cursor-pointer"
        >
            <BiLogOut className="inline text-xl mr-2" />
            Logout
        </button>
    )
}
