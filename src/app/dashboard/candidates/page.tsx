"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Candidate {
    id: number
    nameKetua: string
    nameWakil: string
    visi?: string | null
    misi?: string | null
    foto?: string | null
    electionId: number
}

export default function CandidateDashboard() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [formData, setFormData] = useState({
        nameKetua: "",
        nameWakil: "",
        visi: "",
        misi: "",
        foto: "",
        electionId: "",
    })
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 🔹 Ambil semua kandidat
    useEffect(() => {
        fetchCandidates()
    }, [])

    const fetchCandidates = async () => {
        try {
            const res = await fetch("/api/candidates")
            const data = await res.json()
            setCandidates(data)
        } catch (err) {
            console.error("Error fetching candidates:", err)
        }
    }

    // 🔹 Tambah kandidat baru
    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to add candidate")
            setFormData({ nameKetua: "", nameWakil: "", visi: "", misi: "", foto: "", electionId: "" })
            fetchCandidates()
            alert("Kandidat berhasil ditambahkan!")
        } catch (err) {
            console.error(err)
            alert("Gagal menambahkan kandidat.")
        }
    }

    // 🔹 Update kandidat
    const handleUpdateCandidate = async () => {
        if (!selectedCandidate) return
        try {
            const res = await fetch(`/api/candidates/${selectedCandidate.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedCandidate),
            })
            if (!res.ok) throw new Error("Failed to update candidate")
            setIsModalOpen(false)
            fetchCandidates()
            alert("Kandidat berhasil diperbarui!")
        } catch (err) {
            console.error(err)
            alert("Gagal memperbarui kandidat.")
        }
    }

    // 🔹 Buka modal detail kandidat
    const openCandidateModal = (candidate: Candidate) => {
        setSelectedCandidate(candidate)
        setIsModalOpen(true)
    }

    return (
        <section className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-violet-600">Manajemen Kandidat</h1>

            {/* --- Form Tambah Kandidat --- */}
            <form
                onSubmit={handleAddCandidate}
                className="bg-white p-6 rounded-xl shadow-md mb-10 space-y-3"
            >
                <h2 className="text-lg font-semibold">Tambah Kandidat Baru</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nama Ketua"
                        className="input input-bordered w-full bg-white"
                        value={formData.nameKetua}
                        onChange={(e) => setFormData({ ...formData, nameKetua: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nama Wakil"
                        className="input input-bordered w-full bg-white"
                        value={formData.nameWakil}
                        onChange={(e) => setFormData({ ...formData, nameWakil: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Foto (URL)"
                        className="input input-bordered w-full bg-white"
                        value={formData.foto}
                        onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Election ID"
                        className="input input-bordered w-full bg-white"
                        value={formData.electionId}
                        onChange={(e) => setFormData({ ...formData, electionId: e.target.value })}
                        required
                    />
                </div>
                <textarea
                    placeholder="Visi"
                    className="textarea textarea-bordered w-full bg-white"
                    value={formData.visi}
                    onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                />
                <textarea
                    placeholder="Misi"
                    className="textarea textarea-bordered w-full bg-white"
                    value={formData.misi}
                    onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                />
                <button className="btn btn-primary w-full mt-2">Tambah Kandidat</button>
            </form>

            {/* --- Daftar Kandidat --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition"
                        onClick={() => openCandidateModal(c)}
                    >
                        <div className="h-48 w-full relative">
                            {c.foto ? (
                                <Image
                                    src={c.foto}
                                    alt={`${c.nameKetua} & ${c.nameWakil}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Ketua: {c.nameKetua}</h2>
                            <h3 className="text-md text-gray-700">Wakil: {c.nameWakil}</h3>
                            <p className="mt-2 text-sm text-gray-600 truncate">
                                <span className="font-semibold">Visi:</span> {c.visi || "-"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Modal Edit Kandidat --- */}
            {isModalOpen && selectedCandidate && (
                <dialog open className="modal modal-open">
                    <div className="modal-box max-w-5xl bg-white">
                        <h3 className="font-bold text-lg mb-3">Edit Kandidat</h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                className="input input-bordered w-full bg-white"
                                value={selectedCandidate.nameKetua}
                                onChange={(e) =>
                                    setSelectedCandidate({ ...selectedCandidate, nameKetua: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                className="input input-bordered w-full bg-white"
                                value={selectedCandidate.nameWakil}
                                onChange={(e) =>
                                    setSelectedCandidate({ ...selectedCandidate, nameWakil: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                className="input input-bordered w-full bg-white"
                                placeholder="Foto URL"
                                value={selectedCandidate.foto ?? ""}
                                onChange={(e) =>
                                    setSelectedCandidate({ ...selectedCandidate, foto: e.target.value })
                                }
                            />
                            <textarea
                                className="textarea textarea-bordered w-full bg-white"
                                placeholder="Visi"
                                value={selectedCandidate.visi ?? ""}
                                onChange={(e) =>
                                    setSelectedCandidate({ ...selectedCandidate, visi: e.target.value })
                                }
                            />
                            <textarea
                                className="textarea textarea-bordered w-full bg-white"
                                placeholder="Misi"
                                value={selectedCandidate.misi ?? ""}
                                onChange={(e) =>
                                    setSelectedCandidate({ ...selectedCandidate, misi: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </button>
                            <button className="btn btn-primary" onClick={handleUpdateCandidate}>
                                Simpan
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    )
}
