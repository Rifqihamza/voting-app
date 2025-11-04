"use client"

import { useState } from "react"
import CandidateForm from "./CandidateForm"
import CandidateCard from "./CandidateCard"
import CandidateModal from "./CandidateModal"
import { useCandidates, Candidate } from "../../../hooks/useCandidate"

export default function CandidateDashboard() {
    const { candidates, loading, error, addCandidate, updateCandidate } = useCandidates()
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

    // Helper untuk menampilkan alert sementara
    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 2500)
    }

    return (
        <section className="p-6 max-w-6xl mx-auto relative">
            <h1 className="text-2xl font-bold mb-6 text-violet-600">Manajemen Kandidat</h1>

            <CandidateForm
                onAdd={async (candidate) => {
                    try {
                        await addCandidate(candidate)
                        showToast("success", "Kandidat berhasil ditambahkan ✅")
                    } catch {
                        showToast("error", "Gagal menambahkan kandidat ❌")
                    }
                }}
            />

            {loading && <p className="text-center text-gray-500">Memuat data kandidat...</p>}
            {error && <p className="text-red-600 text-center">Error: {error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {candidates.map((c) => (
                    <CandidateCard key={c.id} candidate={c} onClick={() => setSelectedCandidate(c)} />
                ))}
            </div>

            {selectedCandidate && (
                <CandidateModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                    onSave={async (updated) => {
                        try {
                            await updateCandidate(updated)
                            setSelectedCandidate(null)
                            showToast("success", "Data kandidat berhasil diperbarui ✅")
                        } catch {
                            showToast("error", "Gagal memperbarui kandidat ❌")
                        }
                    }}
                />
            )}

            {/* ✅ Toast (Alert floating) */}
            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <div
                        className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"
                            } shadow-lg`}
                    >
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </section>
    )
}
