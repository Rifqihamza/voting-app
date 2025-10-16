import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "No active session" }, { status: 401 })
    }

    // Hapus session cookie
    const response = NextResponse.json({ message: "Logged out successfully" })
    response.cookies.set("next-auth.session-token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    })
    response.cookies.set("__Secure-next-auth.session-token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    })

    return response
}
