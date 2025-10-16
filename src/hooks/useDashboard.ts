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
    const [elections, setElections] = useState<Election[]>([]) // ⚠️ array
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const res = await fetch("/api/dashboard/election")
                if (!res.ok) throw new Error("Failed to fetch elections")
                const data = await res.json()
                setElections(data) // expect data to be an array
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchElections()
    }, [])

    return { elections, loading, error }
}
