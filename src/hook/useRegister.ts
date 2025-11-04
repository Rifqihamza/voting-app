'use client'

import { useState } from 'react'

type RegisterInput = {
    nis: string
    name: string
    password: string
    kelas: string
}

export function useRegister() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const register = async (data: RegisterInput) => {
        setIsLoading(true)
        setError(null)

        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        })

        setIsLoading(false)

        if (!res.ok) {
            const err = await res.json()
            setError(err.message || 'Gagal register')
            throw new Error(err.message)
        }

        return true
    }

    return { register, isLoading, error }
}