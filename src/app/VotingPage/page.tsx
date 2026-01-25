"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCandidates } from "@/hook/useCandidate"
import { useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"

export default function VotingPage() {
    const { candidates, loading, error } = useCandidates()
    const { data: session, status } = useSession()
    const router = useRouter()

    /**
     * Memoization untuk mencegah re-render map yang tidak perlu
     */
    const candidateList = useMemo(() => {
        return candidates.map((c) => (
            <Link
                key={c.id}
                href={`/VotingPage/${c.id}`}
                title={c.nameKetua}
                className="hover:scale-105 duration-300"
            >
                <h1 className="font-bold text-violet-500 text-center">
                    {c.nameKetua} & {c.nameWakil}
                </h1>

                <p className="text-center font-semibold uppercase tracking-wide mb-2">
                    Paslon {c.id}
                </p>

                <Image
                    src={c.foto || "/placeholder.png"}
                    width={500}
                    height={500}
                    alt={`Foto Paslon ${c.nameKetua}`}
                    className="w-96 h-96 object-contain"
                    priority
                />
            </Link>
        ))
    }, [candidates])

    /**
     * Redirect logic
     * - Dijaga agar tidak berjalan saat status masih loading
     * - Menghindari redirect loop
     */
    useEffect(() => {
        if (status !== "authenticated") {
            if (status === "unauthenticated") {
                router.replace("/Authentication/login")
            }
            return
        }

        if (session.user.role !== "STUDENT") {
            router.replace("/DashboardPage")
        }
    }, [status, session?.user.role, router])

    /**
     * Guard rendering:
     * - Mencegah flash konten sebelum redirect
     */
    if (status !== "authenticated" || session.user.role !== "STUDENT") {
        return (
            <div className="flex justify-center items-center min-h-dvh">
                <p className="text-lg font-medium text-gray-600">
                    Checking access and session status...
                </p>
            </div>
        )
    }

    if (loading) {
        return <p className="text-center mt-10">Loading daftar kandidat...</p>
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-600">
                Error loading candidates
            </p>
        )
    }

    return (
        <main className="w-full max-w-6xl flex flex-col items-center justify-center mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-around items-center gap-10 w-full">
                {candidateList}
            </div>
        </main>
    )
}
