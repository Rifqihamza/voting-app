'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

type LoginInput = {
    nis: string
    password: string
}

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [role, setRole] = useState<string | null>(null)

    const login = async ({ nis, password }: LoginInput) => {
        setIsLoading(true)
        setError(null)

        const res = await signIn('credentials', {
            redirect: false,
            nis,
            password,
        })

        setIsLoading(false)

        if (res?.error) {
            setError(res.error)
            return false
        }

        // Ambil session untuk dapatkan role
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        setRole(session?.user?.role || null)

        return true
    }

    return { login, isLoading, error, role }
}