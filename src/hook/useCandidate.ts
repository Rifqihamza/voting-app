import { useEffect, useState, useCallback } from "react"

export interface Candidate {
    id: number
    electionId?: number
    nameKetua: string
    nameWakil: string
    foto?: string
    visi?: string
    misi?: string
}

export function useCandidates(electionId?: number) {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true)
            const url = electionId ? `/api/candidate?electionId=${electionId}` : "/api/candidate"
            const res = await fetch(url)
            if (!res.ok) throw new Error("Gagal mengambil data kandidat")
            const data = await res.json()
            setCandidates(data)
        } catch (err) {
            console.error(err)
            setError("Terjadi kesalahan saat mengambil data kandidat")
        } finally {
            setLoading(false)
        }
    }, [electionId])

    useEffect(() => {
        fetchCandidates()
    }, [fetchCandidates])

    const addCandidate = async (candidate: Omit<Candidate, "id">) => {
        const res = await fetch("/api/candidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(candidate),
        })
        if (!res.ok) throw new Error("Gagal menambah kandidat")
        const newCandidate: Candidate = await res.json()
        setCandidates((prev) => [...prev, newCandidate])
    }

    const updateCandidate = async (updated: Candidate) => {
        const res = await fetch(`/api/candidate/${updated.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        })
        if (!res.ok) throw new Error("Gagal memperbarui kandidat")
        const newCandidate: Candidate = await res.json()
        setCandidates((prev) => prev.map((c) => (c.id === newCandidate.id ? newCandidate : c)))
    }

    const deleteCandidate = async (id: number) => {
        const res = await fetch(`/api/candidate/${id}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Gagal menghapus kandidat")
        setCandidates((prev) => prev.filter((c) => c.id !== id))
    }

    return { candidates, loading, error, addCandidate, updateCandidate, deleteCandidate }
}
