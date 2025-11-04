'use client'

import { useSession } from 'next-auth/react'

export default function useSessionUser() {
    const { data: session, status } = useSession()
    const user = session?.user

    return {
        user,
        isLoading: status === 'loading',
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    }
}