"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/login" })
    }

    return (
        <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded-2xl border-2 border-violet-400 text-violet-600 hover:border-violet-300 hover:text-violet-400 transition-colors cursor-pointer font-semibold tracking-widest uppercase"
        >
            Logout
        </button>
    )
}
