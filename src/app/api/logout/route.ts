import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST() {
    try {
        // Jalankan signOut dari NextAuth v5
        await signOut({ redirect: false })

        // Hapus cookie session di browser
        const res = NextResponse.json({ message: "Logged out successfully" })
        res.cookies.set("authjs.session-token", "", { expires: new Date(0) })
        res.cookies.set("next-auth.session-token", "", { expires: new Date(0) })

        return res
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: "Logout failed" }, { status: 500 })
    }
}
