import { withAuth } from "next-auth/middleware"
import { authOptions } from "./authOptions"

// Bungkus konfigurasi next-auth agar bisa digunakan di middleware
export const auth = withAuth(authOptions)

// Ekspor supaya bisa digunakan di middleware.ts
export default auth
