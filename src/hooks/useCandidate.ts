"use client"

import { useEffect, useState } from "react"

export interface Candidate {
    id: number
    nameKetua: string
    nameWakil: string
    visi: string
    misi: string
    foto: string
}

export function useCandidates() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await fetch("/api/candidates")
                if (!res.ok) throw new Error("Failed to fetch candidates")
                const data = await res.json()
                setCandidates(data)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchCandidates()
    }, [])

    return { candidates, loading, error }
}
