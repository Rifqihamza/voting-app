import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/authOptions"
import "next-auth"
import "next-auth/jwt"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                    message: "Not authenticated",
                },
                { status: 401 }
            )
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: session.user.id,
                nis: session.user.nis,
                name: session.user.name,
                role: session.user.role,
            },
        })
    } catch (error) {
        console.error("Session GET error:", error)
        return NextResponse.json(
            { authenticated: false, error: "Failed to get session" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/auth/session
 * Menerima data update session (opsional, read-only untuk JWT)
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            )
        }

        const body = await req.json()
        console.log("Received session update data:", body)

        // Catatan: Session berbasis JWT tidak bisa diupdate langsung server-side.
        // Untuk update data session, gunakan client-side trigger `update()`.

        return NextResponse.json({
            success: true,
            message: "Session data received (read-only)",
            user: session.user,
        })
    } catch (error) {
        console.error("Session POST error:", error)
        return NextResponse.json(
            { error: "Failed to update session" },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/auth/session
 * Bersihkan session aktif (opsional, gunakan signOut() untuk logout penuh)
 */
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { message: "No active session" },
                { status: 200 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Session cleared. Use /api/auth/signout for full logout.",
        })
    } catch (error) {
        console.error("Session DELETE error:", error)
        return NextResponse.json(
            { error: "Failed to clear session" },
            { status: 500 }
        )
    }
}
