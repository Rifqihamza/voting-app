"use client"

import { useEffect, useState } from "react"

// Tipe Election sesuai schema Prisma
export interface Election {
    id: number
    title: string
    description?: string | null
    startAt: string
    endAt: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
}

// Tipe untuk input (saat create/update)
export type ElectionInput = Omit<Election, "id" | "createdAt" | "updatedAt">

export function useElection(id?: number) {
    const [elections, setElections] = useState<Election[]>([])
    const [election, setElection] = useState<Election | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Ambil semua atau satu election
    useEffect(() => {
        const fetchElections = async () => {
            setLoading(true)
            try {
                const res = await fetch(id ? `/api/election/${id}` : `/api/election`)
                const data: { success: boolean; data: Election | Election[]; message?: string } = await res.json()

                if (!data.success) throw new Error(data.message)

                if (id) setElection(data.data as Election)
                else setElections(data.data as Election[])
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Unknown error"
                setError(msg)
            } finally {
                setLoading(false)
            }
        }

        fetchElections()
    }, [id])

    // CREATE election
    const createElection = async (newElection: Omit<Election, "id" | "createdAt" | "updatedAt">) => {
        try {
            const res = await fetch("/api/election", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newElection),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to create election")
            }

            const created = await res.json()
            setElections((prev) => [created, ...prev])
            return created // ✅ penting
        } catch (err) {
            console.error("createElection error:", err)
            throw err // ✅ supaya masuk ke catch di komponen
        }
    }

    // UPDATE election
    const updateElection = async (id: number, updated: Partial<ElectionInput>): Promise<void> => {
        try {
            const res = await fetch(`/api/election/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            })

            const data: { success: boolean; data?: Election; message?: string } = await res.json()
            if (!data.success || !data.data) throw new Error(data.message)

            setElections((prev) => prev.map((e) => (e.id === id ? data.data! : e)))
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to update election"
            setError(msg)
            throw err
        }
    }

    // DELETE election
    const deleteElection = async (id: number): Promise<void> => {
        try {
            const res = await fetch(`/api/election/${id}`, { method: "DELETE" })
            const data: { success: boolean; message?: string } = await res.json()

            if (!data.success) throw new Error(data.message)
            setElections((prev) => prev.filter((e) => e.id !== id))
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to delete election"
            setError(msg)
            throw err
        }
    }

    const actionElection = async (id: number, action: "start" | "reset") => {
        try {
            const res = await fetch(`/api/election/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            const data: { success: boolean; message?: string } = await res.json()
            if (!data.success) throw new Error(data.message)
            setElections((prev) => prev.map((e) => (e.id === id ? { ...e, isPublished: action === "start" } : e)))
        } catch (err) {
            const msg = err instanceof Error ? err.message : `Failed to ${action} election`
            setError(msg)
            throw err
        }
    }

    return {
        elections,
        election,
        loading,
        error,
        createElection,
        updateElection,
        deleteElection,
        actionElection,
    }
}
