"use client"

import { useEffect, useState } from "react"
import { useSession as useNextAuthSession } from "next-auth/react"

export interface User {
    id: number
    nis: string
    name: string
    role: string
}

export interface SessionData {
    authenticated: boolean
    user: User | null
    isLoading: boolean
    error: string | null
}

/**
 * Custom hook untuk mengambil session data
 * Menggunakan NextAuth session dengan additional features
 */
export function useSession(): SessionData {
    const { data: session, status } = useNextAuthSession()
    const [error, setError] = useState<string | null>(null)

    const isLoading = status === "loading"
    const authenticated = status === "authenticated"

    useEffect(() => {
        if (status === "unauthenticated") {
            setError("Not authenticated")
        } else {
            setError(null)
        }
    }, [status])

    return {
        authenticated,
        user: session?.user || null,
        isLoading,
        error,
    }
}

/**
 * Hook untuk mengecek apakah user memiliki role tertentu
 */
export function useRequireRole(allowedRoles: string[]) {
    const { user, authenticated, isLoading } = useSession()
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        if (!isLoading && authenticated && user) {
            setHasAccess(allowedRoles.includes(user.role))
        } else {
            setHasAccess(false)
        }
    }, [user, authenticated, isLoading, allowedRoles])

    return {
        hasAccess,
        isLoading,
        user,
    }
}

/**
 * Hook untuk require admin access
 */
export function useRequireAdmin() {
    return useRequireRole(["ADMIN"])
}

/**
 * Fetch session dari API (alternative method)
 */
export async function fetchSession(): Promise<SessionData> {
    try {
        const response = await fetch("/api/auth/session")

        if (!response.ok) {
            return {
                authenticated: false,
                user: null,
                isLoading: false,
                error: "Failed to fetch session",
            }
        }

        const data = await response.json()

        return {
            authenticated: data.authenticated,
            user: data.user,
            isLoading: false,
            error: null,
        }
    } catch (error) {
        console.error("Fetch session error:", error)
        return {
            authenticated: false,
            user: null,
            isLoading: false,
            error: "Network error",
        }
    }
}