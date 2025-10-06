"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Vote, Activity } from "lucide-react"

interface OverviewData {
    participants: number
    candidates: number
    votes: number
    status: string
}

export default function HomeDashboard() {
    const [overview, setOverview] = useState<OverviewData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOverview() {
            try {
                const res = await fetch("/api/overview")
                const data = await res.json()
                setOverview(data)
            } catch (error) {
                console.error("Gagal memuat data overview:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOverview()
    }, [])

    if (loading)
        return (
            <p className="text-center mt-10 text-gray-500">Memuat data overview...</p>
        )

    if (!overview)
        return (
            <p className="text-center mt-10 text-red-500">
                Gagal memuat data overview.
            </p>
        )

    return (
        <section className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-violet-600">
                    Overview Pemilihan
                </h1>
                <p className="text-gray-600">
                    Ringkasan data real-time pemilihan OSIS
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-violet-100 rounded-lg">
                        <Users className="text-violet-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Peserta</h2>
                        <p className="text-3xl font-bold text-violet-600">
                            {overview.participants}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-amber-100 rounded-lg">
                        <UserCheck className="text-amber-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Kandidat</h2>
                        <p className="text-3xl font-bold text-amber-600">
                            {overview.candidates}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                        <Vote className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Votes Masuk</h2>
                        <p className="text-3xl font-bold text-emerald-600">
                            {overview.votes}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4 border border-gray-100">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Activity className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Status</h2>
                        <p
                            className={`text-xl font-semibold ${overview.status === "Sedang Berlangsung"
                                ? "text-green-600"
                                : "text-gray-500"
                                }`}
                        >
                            {overview.status}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
