// middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const session = await auth() // <-- Panggil tanpa argumen

    const { pathname } = req.nextUrl

    // 🔒 Jika belum login, redirect ke login
    if (!session) {
        const loginUrl = new URL("/AuthPage/login", req.url)
        loginUrl.searchParams.set("from", pathname)
        return NextResponse.redirect(loginUrl)
    }

    const role = session.user?.role

    // 🔐 Hanya STUDENT boleh ke VotingPage
    if (pathname.startsWith("/VotingPage") && role !== "STUDENT") {
        return NextResponse.redirect(new URL("/AuthPage/login", req.url))
    }

    // 🔐 Hanya ADMIN boleh ke DashboardPage
    if (pathname.startsWith("/DashboardPage") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/AuthPage/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/VotingPage/:path*", "/DashboardPage/:path*"],
}
