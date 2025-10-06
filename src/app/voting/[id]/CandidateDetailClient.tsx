// app/voting/[id]/CandidateDetailClient.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useVote } from "@/hooks/useVote"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CandidateDetailClientProps {
    candidate: {
        id: number
        nameKetua: string
        nameWakil: string
        visi?: string | null
        misi?: string | null
        foto?: string | null
        electionId: number
    }
}

export default function CandidateDetailClient({ candidate }: CandidateDetailClientProps) {
    const { vote, loading, error, success } = useVote()
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState<"success" | "error" | null>(null)
    const router = useRouter()

    const handleVote = async () => {
        await vote(candidate.id, candidate.electionId)
    }

    // efek saat vote berhasil/gagal
    useEffect(() => {
        if (success) {
            setModalType("success")
            setModalMessage("✅ Voting berhasil! Anda akan logout dalam 3 detik...")
            setShowModal(true)

            // Clear session dan logout otomatis
            setTimeout(() => {
                localStorage.clear()
                sessionStorage.clear()
                router.push("/") // arahkan ke halaman login
            }, 3000)
        } else if (error) {
            setModalType("error")
            setModalMessage("❌ Voting gagal! Silakan coba lagi.")
            setShowModal(true)
        }
    }, [success, error, router])

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <section className="w-full max-w-7xl h-full mx-auto flex items-center justify-center p-5">
            <div className="p-4 rounded-2xl shadow-md shadow-gray-400 relative">
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    <Image
                        src={candidate.foto || "/placeholder.jpg"}
                        alt={candidate.nameKetua}
                        width={500}
                        height={500}
                        className="w-64 h-64 md:w-96 md:h-96 object-contain mx-auto"
                    />
                    <div className="container p-4">
                        <div>
                            <h1 className="text-3xl font-bold text-violet-500">
                                {candidate.nameKetua} & {candidate.nameWakil}
                            </h1>
                            <div className="space-y-4 mt-3">
                                <div>
                                    <h2 className="text-xl font-semibold text-violet-500">Visi:</h2>
                                    <p>{candidate.visi}</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-violet-500">Misi:</h2>
                                    <p>{candidate.misi}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-center md:justify-start mt-2 gap-2">
                            <button
                                onClick={handleVote}
                                disabled={loading}
                                className="cursor-pointer inline-block mt-3 px-8 py-1 rounded-2xl bg-violet-600 text-white border border-violet-500 hover:bg-violet-700 duration-300"
                            >
                                {loading ? "Voting..." : "Vote"}
                            </button>
                            <Link
                                href={`/voting`}
                                className="inline-block mt-3 px-8 py-1 rounded-2xl bg-white text-violet-500 border border-violet-500 hover:bg-violet-700 hover:text-white duration-300"
                            >
                                Kembali
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ✅ Modal Alert */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                            <h2
                                className={`text-xl font-semibold ${modalType === "success" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {modalType === "success" ? "Vote Success!" : "Vote Failed!"}
                            </h2>
                            <p className="mt-3 text-gray-700">{modalMessage}</p>
                            {modalType === "error" && (
                                <button
                                    onClick={closeModal}
                                    className="mt-5 px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                                >
                                    Tutup
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
