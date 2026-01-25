'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LoginData = {
    nis: string
    password: string
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const login = async ({ nis, password }: LoginData) => {
        setIsLoading(true)
        setError(null)

        const res = await signIn('credentials', {
            redirect: false,
            nis,
            password,
        })

        if (res?.error) {
            setError(res.error || "Login failed")
            setIsLoading(false)
            return false
        }

        // Get session to determine redirect
        const sessionRes = await fetch('/api/auth/session')
        if (sessionRes.ok) {
            const session = await sessionRes.json()
            const userRole = session?.user?.role
            if (userRole === "ADMIN") {
                router.push("/DashboardPage")
            } else if (userRole === "STUDENT") {
                router.push("/VotingPage")
            } else {
                setError("Invalid user role")
            }
        } else {
            setError("Failed to get session")
        }

        setIsLoading(false)
        return true
    }

    return { login, isLoading, error }
}
