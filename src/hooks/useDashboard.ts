"use client"

import { useEffect, useState } from "react"

export interface Election {
    id: number
    title: string
    description: string
    startDate: string
    endDate: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
}

export function useElection() {
    const [election, setElection] = useState<Election | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchElection = async () => {
            try {
                const res = await fetch("/api/election")
                if (!res.ok) throw new Error("Failed to fetch election")
                const data = await res.json()
                setElection(data)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchElection()
    }, [])
    return { election, loading, error }
}