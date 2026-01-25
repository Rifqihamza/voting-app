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

    const executeVote = useCallback(async () => {
        setShowConfirm(false)
        await vote(candidate.id, candidate.electionId)
    }, [vote, candidate.id, candidate.electionId])

    useEffect(() => {
        if (!success && !error) return

        if (success) {
            setModalType("success")
            setModalMessage("Voting berhasil. Terima kasih telah menggunakan hak pilih Anda.")
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
            setModalMessage(`Voting gagal. ${error}`)
            setShowResult(true)
        }
    }, [success, error, router])

    return (
        <section className="relative min-h-dvh w-full flex items-center justify-center px-4 py-10">
            <span id="voting"></span>
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden z-50">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* LEFT – IMAGE */}
                    <div className="relative bg-linear-to-r from-violet-400 to-100% flex items-center justify-center px-10 py-6 md:px-20 md:py-10">
                        <div className="relative w-full h-full aspect-square flex items-center justify-center">
                            <Image
                                src={candidate.foto || "/placeholder.png"}
                                alt={`Foto ${candidate.nameKetua}`}
                                width={250}
                                height={250}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* RIGHT – CONTENT */}
                    <div className="p-8 md:p-10">
                        <span className="inline-block mb-3 rounded-full bg-violet-100 text-violet-700 px-4 py-1 text-sm font-semibold">
                            Paslon {candidate.id}
                        </span>

                        <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
                            {candidate.nameKetua} & {candidate.nameWakil}
                        </h1>

                        <div className="mt-8 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-violet-600 mb-1">
                                    Visi
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {candidate.visi || "Tidak ada visi yang dituliskan."}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-violet-600 mb-1">
                                    Misi
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {candidate.misi || "Tidak ada misi yang dituliskan."}
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-10 flex flex-wrap gap-4">
                            <button
                                onClick={() => setShowConfirm(true)}
                                disabled={loading}
                                className="
                                    px-8 py-3 rounded-xl
                                    bg-violet-600 text-white font-semibold
                                    hover:bg-violet-700
                                    transition-all
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {loading ? "Processing..." : "Confirm & Vote"}
                            </button>

                            <Link
                                href="/VotingPage"
                                className="
                                    px-8 py-3 rounded-xl
                                    border border-violet-500
                                    text-violet-600 font-semibold
                                    hover:bg-violet-600 hover:text-white
                                    transition-all
                                "
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔐 CONFIRM MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            Konfirmasi Voting
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Anda akan memilih:
                            <br />
                            <strong className="text-gray-800">
                                {candidate.nameKetua} & {candidate.nameWakil}
                            </strong>
                        </p>
                        <p className="mt-2 text-sm text-red-500">
                            Pilihan tidak dapat diubah.
                        </p>

                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={executeVote}
                                disabled={loading}
                                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                            >
                                Ya, Vote
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📣 RESULT MODAL */}
            {showResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <h2
                            className={`text-xl font-bold ${modalType === "success"
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            {modalType === "success"
                                ? "Voting Berhasil"
                                : "Voting Gagal"}
                        </h2>

                        <p className="mt-4 text-gray-700">{modalMessage}</p>

                        {modalType === "error" && (
                            <button
                                onClick={() => setShowResult(false)}
                                className="mt-6 px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
                            >
                                Tutup
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
