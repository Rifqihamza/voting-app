export { auth as middleware } from "./auth"

// Optional: matcher untuk path tertentu
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"], // hanya halaman tertentu
}
