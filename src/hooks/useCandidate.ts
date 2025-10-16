"use client"

import { useEffect, useState } from "react"

export interface Candidate {
    id: number
    nameKetua: string
    nameWakil: string
    visi?: string | null
    misi?: string | null
    foto: string
    electionId: number
}

/** 🔹 Helper internal untuk request API */
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    })

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || `Request failed: ${res.status}`)
    }

    return res.json()
}

export function useCandidates() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /** 🔹 Ambil semua kandidat */
    async function fetchCandidates() {
        setLoading(true)
        setError(null)
        try {
            const data = await apiRequest<Candidate[]>("/api/dashboard/candidates")
            setCandidates(data)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    /** 🔹 Tambah kandidat baru */
    async function addCandidate(candidate: Omit<Candidate, "id">) {
        try {
            await apiRequest("/api/dashboard/candidates", {
                method: "POST",
                body: JSON.stringify(candidate),
            })
            await fetchCandidates()
        } catch (err) {
            setError((err as Error).message)
            throw err
        }
    }

    /** 🔹 Update kandidat */
    async function updateCandidate(candidate: Candidate) {
        try {
            await apiRequest(`/api/dashboard/candidates/${candidate.id}`, {
                method: "PUT",
                body: JSON.stringify(candidate),
            })
            await fetchCandidates()
        } catch (err) {
            setError((err as Error).message)
            throw err
        }
    }

    useEffect(() => {
        fetchCandidates()
    }, [])

    return { candidates, loading, error, addCandidate, updateCandidate }
}
