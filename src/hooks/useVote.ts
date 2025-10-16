// src/hooks/useVote.ts
import { useState } from "react"

export function useVote() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const vote = async (candidateId: number, electionId: number) => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch("/api/main/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ candidateId, electionId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Vote failed")
            setSuccess(data.message)
            return { success: true }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
            setError(msg)
            return { success: false, message: msg }
        } finally {
            setLoading(false)
        }
    }

    return { vote, loading, error, success }
}
