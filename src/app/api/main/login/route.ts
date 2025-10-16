// src/api/login/route.ts atau hook useLogin.ts
import { useState } from "react"
import { signIn } from "next-auth/react"

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)

    const login = async (nis: string, password: string) => {
        setIsLoading(true)
        try {
            const res = await signIn("credentials", {
                redirect: false,
                nis,
                password,
            })

            if (!res || res.error) {
                return { success: false, message: res?.error || "Login gagal" }
            }

            // kalau sukses, ambil role dari token/session
            return { success: true, role: "STUDENT" }
        } catch (err) {
            return { success: false, message: "Terjadi error, coba lagi", err }
        } finally {
            setIsLoading(false)
        }
    }

    return { login, isLoading }
}
