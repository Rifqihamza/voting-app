import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (!token) return false
            // Hanya admin yang bisa akses /admin/*
            if (token.role === "ADMIN") return true
            return false
        },
    },
})

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
}
