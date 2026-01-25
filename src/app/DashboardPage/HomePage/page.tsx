"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, UserCheck, Vote, Activity, RefreshCw, TrendingUp, Calendar, BarChart3 } from "lucide-react"

interface OverviewData {
    participants: number
    candidates: number
    votes: number
    status: string
}

export default function HomeDashboard() {
    const [overview, setOverview] = useState<OverviewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const router = useRouter()

    const fetchOverview = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true)
        try {
            const res = await fetch("/api/overview")
            const data = await res.json()
            setOverview(data)
        } catch (error) {
            console.error("Gagal memuat data overview:", error)
        } finally {
            setLoading(false)
            if (showRefresh) setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchOverview()
    }, [])

    // Auto refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOverview()
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleRefresh = () => {
        fetchOverview(true)
    }

    const calculateParticipationRate = () => {
        if (!overview || overview.participants === 0) return 0
        return Math.round((overview.votes / overview.participants) * 100)
    }

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )

    if (!overview)
        return (
            <div className="text-center mt-10">
                <p className="text-red-500 mb-4">Gagal memuat data overview.</p>
                <button
                    onClick={() => fetchOverview(true)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                    Coba Lagi
                </button>
            </div>
        )

    return (
        <section className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-violet-600">
                        Overview Pemilihan
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan data real-time pemilihan OSIS
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => router.push('/DashboardPage/UserPage')}
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-100 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-100 rounded-lg group-hover:bg-violet-200 transition">
                                <Users className="text-violet-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Peserta</h2>
                                <p className="text-3xl font-bold text-violet-600">
                                    {overview.participants}
                                </p>
                            </div>
                        </div>
                        <TrendingUp className="text-violet-400 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                </div>

                <div
                    onClick={() => router.push('/DashboardPage/CandidatePage')}
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-100 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition">
                                <UserCheck className="text-amber-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Kandidat</h2>
                                <p className="text-3xl font-bold text-amber-600">
                                    {overview.candidates}
                                </p>
                            </div>
                        </div>
                        <BarChart3 className="text-amber-400 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                </div>

                <div
                    onClick={() => router.push('/DashboardPage/AnalyticsPage')}
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-100 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition">
                                <Vote className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Votes Masuk</h2>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {overview.votes}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {calculateParticipationRate()}% partisipasi
                                </p>
                            </div>
                        </div>
                        <TrendingUp className="text-emerald-400 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                </div>

                <div
                    onClick={() => router.push('/DashboardPage/ElectionPage')}
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer hover:scale-105 border border-gray-100 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                                <Activity className="text-blue-600 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Status</h2>
                                <p
                                    className={`text-xl font-semibold ${overview.status === "Sedang Berlangsung"
                                        ? "text-green-600"
                                        : overview.status === "Selesai"
                                            ? "text-gray-600"
                                            : "text-orange-600"
                                        }`}
                                >
                                    {overview.status}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">Manage</span>
                                </div>
                            </div>
                        </div>
                        <Activity className="text-blue-400 w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/DashboardPage/UserPage')}
                            className="w-full flex items-center gap-3 p-3 bg-violet-50 hover:bg-violet-100 rounded-lg transition"
                        >
                            <Users className="w-5 h-5 text-violet-600" />
                            <span className="text-sm font-medium">Manage Participants</span>
                        </button>
                        <button
                            onClick={() => router.push('/DashboardPage/CandidatePage')}
                            className="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                        >
                            <UserCheck className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-medium">Manage Candidates</span>
                        </button>
                        <button
                            onClick={() => router.push('/DashboardPage/ElectionPage')}
                            className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium">Manage Elections</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium">Data refreshed</p>
                                <p className="text-xs text-gray-500">Just now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium">System online</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Database</span>
                            <span className="text-sm font-medium text-green-600">✓ Connected</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">API Status</span>
                            <span className="text-sm font-medium text-green-600">✓ Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Last Update</span>
                            <span className="text-sm font-medium text-gray-600">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
