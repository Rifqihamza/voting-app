"use client"

import { signOut } from "next-auth/react"
import { BiLogOut } from "react-icons/bi"

export default function LogoutButton() {
    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        await signOut({ callbackUrl: "/" })
        sessionStorage.clear()
        localStorage.clear()
    }

    return (
        <button
            onClick={handleLogout}
            className="bg-error/30 px-2 py-1 rounded-lg text-md uppercase tracking-widest flex items-center font-semibold text-red-500 hover:text-red-300 transition-colors cursor-pointer"
        >
            <BiLogOut className="inline text-xl mr-2" />
            Logout
        </button>
    )
}
