"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCandidates } from "@/hook/useCandidate"
import { useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import LogoutButton from "@/components/LogoutComponent/LogoutButton"

export default function VotingPage() {
    const { candidates, loading, error } = useCandidates()
    const { data: session, status } = useSession()
    const router = useRouter()

    const candidateList = useMemo(() => {
        return candidates.map((c) => (
            <Link
                key={c.id}
                href={`/VotingPage/${c.id}`}
                aria-label={`Pilih paslon ${c.nameKetua} dan ${c.nameWakil}`}
                className="group relative rounded-2xl border border-violet-200 bg-white bg-linear-to-b from-violet-900 to-80% shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-500 overflow-hidden"
            >
                {/* Badge Paslon */}
                <span className="
                    absolute top-4 left-4 z-10
                    rounded-full bg-violet-600 text-white
                    px-3 py-1 text-xs font-semibold
                ">
                    Paslon {c.id}
                </span>

                {/* Image Section */}
                <div className="flex justify-center items-center p-6  rounded-t-2xl">
                    <Image
                        src={c.foto || "/placeholder.png"}
                        width={300}
                        height={300}
                        alt={`Foto Paslon ${c.nameKetua}`}
                        className="
                            h-56 w-auto object-contain
                            transition-transform duration-300
                            group-hover:scale-105
                        "
                        priority
                    />
                </div>

                {/* Content */}
                <div className="p-5 text-center space-y-2">
                    <h2 className="text-lg font-bold text-gray-800">
                        {c.nameKetua}
                        <span className="block text-sm font-medium text-gray-500">
                            & {c.nameWakil}
                        </span>
                    </h2>

                    <div className="pt-3">
                        <span className="
                            inline-block rounded-full
                            bg-violet-100 text-violet-700
                            px-4 py-1 text-sm font-semibold
                            group-hover:bg-violet-600
                            group-hover:text-white
                            transition-colors
                        ">
                            Lihat Detail & Vote →
                        </span>
                    </div>
                </div>
            </Link>
        ))
    }, [candidates])

    useEffect(() => {
        if (status !== "authenticated") {
            if (status === "unauthenticated") {
                router.replace("/AuthPage/login")
            }
            return
        }

        if (session.user.role !== "STUDENT") {
            router.replace("/DashboardPage")
        }
    }, [status, session?.user.role, router])

    if (status !== "authenticated" || session.user.role !== "STUDENT") {
        return (
            <div className="flex flex-col justify-center items-center min-h-dvh">
                <span className="loading loading-spinner loading-xl text-black"></span>
                <p className="text-lg font-medium text-gray-600">
                    Checking access and session status...
                </p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className=" w-full h-dvh flex flex-col items-center justify-center">
                <span className="loading loading-spinner loading-xl text-black"></span>
            </div>
        )
    }

    if (error) {
        return (
            <div className=" w-full h-dvh flex flex-col items-center justify-center">
                <p className="text-center mt-10 text-red-600">
                    Error loading candidates
                </p>
            </div>
        )
    }

    return (
        <main className="relative w-full min-h-dvh">
            <span id="voting"></span>
            <div className="relative w-full max-w-7xl min-h-dvh mx-auto py-10 px-6 space-y-10">
                <div className="md:absolute bottom-0 right-0">
                    <LogoutButton />
                </div>
                <header className="text-center">
                    <h1 className="text-3xl font-extrabold text-violet-700">
                        Pemilihan Ketua OSIS
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Pilih pasangan calon terbaik menurutmu
                    </p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                    {candidateList}
                </div>
            </div>
        </main>
    )
}
