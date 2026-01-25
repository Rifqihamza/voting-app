// app/voting/[id]/VoteCandidateClient.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useVote } from "@/hook/useVote"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Candidate {
    id: number
    nameKetua: string
    nameWakil: string
    visi?: string | null
    misi?: string | null
    foto?: string | null
    electionId: number
}

interface VoteCandidateClientProps {
    candidate: Candidate
}

type ModalType = "success" | "error" | null

export default function VoteCandidateClient({ candidate }: VoteCandidateClientProps) {
    const { vote, loading, error, success } = useVote()
    const router = useRouter()

    const [showConfirm, setShowConfirm] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [modalType, setModalType] = useState<ModalType>(null)
    const [modalMessage, setModalMessage] = useState("")

    /**
     * Execute vote action
     */
    const executeVote = useCallback(async () => {
        setShowConfirm(false)
        await vote(candidate.id, candidate.electionId)
    }, [vote, candidate.id, candidate.electionId])

    /**
     * Handle vote result
     */
    useEffect(() => {
        if (!success && !error) return

        if (success) {
            setModalType("success")
            setModalMessage("✅ Voting berhasil! Anda akan logout dalam 3 detik...")
            setShowResult(true)

            const timer = setTimeout(() => {
                localStorage.clear()
                sessionStorage.clear()
                router.replace("/")
            }, 3000)

            return () => clearTimeout(timer)
        }

        if (error) {
            setModalType("error")
            setModalMessage(`❌ Voting gagal! ${error}`)
            setShowResult(true)
        }
    }, [success, error, router])

    return (
        <section className="w-full max-w-7xl h-full mx-auto flex items-center justify-center p-5">
            <div className="p-4 rounded-2xl shadow-md shadow-gray-400 relative">
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto bg-linear-to-br from-violet-100 to-purple-100 rounded-lg">
                        <Image
                            src={candidate.foto || "/placeholder.png"}
                            alt={`Foto ${candidate.nameKetua}`}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <div className="container p-4">
                        <h1 className="text-3xl font-bold text-violet-500">
                            {candidate.nameKetua} & {candidate.nameWakil}
                        </h1>
                        <p className="text-violet-400 font-medium mt-1">
                            Candidate {candidate.id}
                        </p>

                        <div className="space-y-4 mt-6">
                            <div>
                                <h2 className="text-xl font-semibold text-violet-500">
                                    Vision:
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    {candidate.visi || "No vision statement provided."}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-violet-500">
                                    Mission:
                                </h2>
                                <p className="text-gray-700 mt-2 whitespace-pre-line">
                                    {candidate.misi || "No mission statement provided."}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-center md:justify-start mt-8 gap-4">
                            <button
                                onClick={() => setShowConfirm(true)}
                                disabled={loading}
                                className="cursor-pointer inline-block px-8 py-3 rounded-xl bg-violet-600 text-white border border-violet-500 hover:bg-violet-700 duration-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Vote for this candidate"}
                            </button>

                            <Link
                                href="/voting"
                                className="inline-block px-8 py-3 rounded-xl bg-white text-violet-500 border border-violet-500 hover:bg-violet-700 hover:text-white duration-300 transition-colors"
                            >
                                Back to Candidates
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 🔐 Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
                            <h2 className="text-xl font-semibold text-violet-600 mb-4">
                                Confirm Your Vote
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to vote for{" "}
                                <strong>
                                    {candidate.nameKetua} & {candidate.nameWakil}
                                </strong>
                                ?
                                <br />
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={executeVote}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Confirm Vote"}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 📣 Result Modal */}
                {showResult && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                            <h2
                                className={`text-xl font-semibold ${modalType === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {modalType === "success"
                                    ? "Vote Success!"
                                    : "Vote Failed!"}
                            </h2>

                            <p className="mt-3 text-gray-700">{modalMessage}</p>

                            {modalType === "error" && (
                                <button
                                    onClick={() => setShowResult(false)}
                                    className="mt-5 px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
