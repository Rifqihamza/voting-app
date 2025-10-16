import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const { pathname } = req.nextUrl

        // ===== [1] Jika belum login, arahkan ke /login =====
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url))
        }

        // ===== [2] Jika sudah login tapi akses /login atau /register, redirect ke home =====
        if (pathname === "/login" || pathname === "/register") {
            return NextResponse.redirect(new URL("/", req.url))
        }

        // ===== [3] Role-based route protection =====
        if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
            // Kalau bukan admin tapi buka /admin → tolak
            return NextResponse.redirect(new URL("/unauthorized", req.url))
        }

        // ===== [4] Jika semua lolos, lanjutkan =====
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: () => true, // biar semua request bisa diproses dulu di middleware
        },
    }
)

// ===== [5] Tentukan halaman yang dilindungi =====
export const config = {
    matcher: [
        "/dashboard/:path*",  // halaman login user
        "/profile/:path*",
        "/admin/:path*",      // halaman admin
        "/login",
        "/register",
    ],
}
