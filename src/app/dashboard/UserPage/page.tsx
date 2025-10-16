"use client"

import { useEffect, useState } from "react"

interface Participant {
    id: number
    name: string
    nis: string
    role: string
    kelas: string
    createdAt: string
    updatedAt: string
    hasVoted: boolean
}

export default function ParticipantDashboard() {
    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const res = await fetch("/api/dashboard/participants")
                if (!res.ok) throw new Error("Gagal mengambil data peserta")
                const data = await res.json()

                // Filter agar admin tidak ditampilkan
                const filtered = data.filter((p: Participant) => p.role !== "ADMIN")
                setParticipants(filtered)
            } catch (err) {
                console.error(err)
                setError("Terjadi kesalahan saat mengambil data peserta")
            } finally {
                setLoading(false)
            }
        }

        fetchParticipants()
    }, [])

    if (loading) return <p className="text-center mt-10 text-gray-600">Memuat data...</p>
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

    return (
        <main className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-violet-600">Daftar Peserta</h1>
                <span className="text-sm text-gray-500">{participants.length} Peserta</span>
            </div>

            <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-violet-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Nama</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">NIS</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Kelas</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Dibuat</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Diperbarui</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">Status Voting</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {participants.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-500">
                                    Tidak ada peserta ditemukan.
                                </td>
                            </tr>
                        ) : (
                            participants.map((p, index) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-violet-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-3 text-gray-700 text-sm">{index + 1}</td>
                                    <td className="px-6 py-3 text-gray-800 font-medium">{p.name}</td>
                                    <td className="px-6 py-3 text-gray-600">{p.nis}</td>
                                    <td className="px-6 py-3 text-gray-600">{p.kelas || "-"}</td>
                                    <td className="px-6 py-3 text-gray-500 text-sm">
                                        {new Date(p.createdAt).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-3 text-gray-500 text-sm">
                                        {new Date(p.updatedAt).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${p.hasVoted
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${p.hasVoted ? "bg-green-500" : "bg-red-500"}`}
                                            ></span>
                                            {p.hasVoted ? "Voted" : "Not Voted"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
