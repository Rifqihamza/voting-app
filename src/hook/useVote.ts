import { useState } from "react"

export function useVote() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const vote = async (candidateId: number, electionId: number) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ candidateId, electionId }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Voting failed")
            }

            setSuccess(true)
        } catch (err) {
            console.error("Vote error:", err)
            setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return { vote, loading, error, success }
}