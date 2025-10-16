"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileDown, TrendingUp, Users, Vote } from "lucide-react"
import * as XLSX from "xlsx"

interface CandidateData {
    id: number
    nameKetua: string
    nameWakil: string
    totalVotes: number
}

export default function AnalyticDashboard() {
    const [data, setData] = useState<CandidateData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/analytics")
                const result = await res.json()
                setData(result)
            } catch (error) {
                console.error("Gagal mengambil data analitik:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleExport = () => {
        if (!data.length) {
            alert("Tidak ada data untuk diekspor")
            return
        }

        const ws = XLSX.utils.json_to_sheet(
            data.map((c, index) => ({
                No: index + 1,
                Ketua: c.nameKetua,
                Wakil: c.nameWakil,
                "Jumlah Suara": c.totalVotes,
            }))
        )
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Analisis Voting")
        XLSX.writeFile(wb, "Hasil_Voting.xlsx")
    }

    const totalVotes = data.reduce((sum, c) => sum + c.totalVotes, 0)
    const topCandidate = data.length > 0 ? data.reduce((prev, current) =>
        (prev.totalVotes > current.totalVotes) ? prev : current
    ) : null

    return (
        <section className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Analisis Hasil Pemilihan
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Ringkasan hasil suara untuk setiap kandidat
                    </p>
                </div>

                <button
                    onClick={handleExport}
                    disabled={!data.length}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                    <FileDown size={18} /> Export Excel
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg text-violet-600"></div>
                        <p className="text-gray-500 mt-4">Memuat data analitik...</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Kandidat */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Kandidat</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{data.length}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                <Users className="text-blue-600" size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Total Suara */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Suara</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{totalVotes.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                                <Vote className="text-purple-600" size={28} />
                            </div>
                        </div>
                    </div>

                    {/* Kandidat Teratas */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Kandidat Teratas</p>
                                {topCandidate ? (
                                    <>
                                        <p className="text-lg font-bold text-gray-900 mt-2 truncate">{topCandidate.nameKetua}</p>
                                        <p className="text-sm text-gray-500 truncate">{topCandidate.totalVotes} suara</p>
                                    </>
                                ) : (
                                    <p className="text-lg text-gray-400 mt-2">-</p>
                                )}
                            </div>
                            <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex-shrink-0">
                                <TrendingUp className="text-pink-600" size={28} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Data */}
            {!loading && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Data Perolehan Suara</h2>
                        <p className="text-sm text-gray-600 mt-1">Daftar lengkap hasil voting</p>
                    </div>

                    {data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-violet-100 to-purple-100">
                                    <tr>
                                        <th className="py-4 px-6 text-left font-semibold text-violet-700">No</th>
                                        <th className="py-4 px-6 text-left font-semibold text-violet-700">Ketua</th>
                                        <th className="py-4 px-6 text-left font-semibold text-violet-700">Wakil</th>
                                        <th className="py-4 px-6 text-center font-semibold text-violet-700">Jumlah Suara</th>
                                        <th className="py-4 px-6 text-center font-semibold text-violet-700">Persentase</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((c, index) => {
                                        const percentage = totalVotes > 0 ? ((c.totalVotes / totalVotes) * 100).toFixed(1) : "0.0"
                                        return (
                                            <tr
                                                key={c.id}
                                                className="hover:bg-violet-50 border-b border-gray-100 last:border-none transition-colors duration-150"
                                            >
                                                <td className="py-4 px-6 text-gray-700 font-medium">{index + 1}</td>
                                                <td className="py-4 px-6 text-gray-900 font-semibold">{c.nameKetua}</td>
                                                <td className="py-4 px-6 text-gray-700">{c.nameWakil}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center justify-center px-3 py-1 bg-violet-100 text-violet-700 font-bold rounded-lg">
                                                        {c.totalVotes.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="text-purple-600 font-semibold">{percentage}%</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data Voting</h3>
                            <p className="text-gray-500">Data hasil voting akan muncul di sini setelah ada suara yang masuk</p>
                        </div>
                    )}
                </div>
            )}

            {/* Grafik Bar */}
            {!loading && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Grafik Perolehan Suara</h2>
                        <p className="text-sm text-gray-600 mt-1">Visualisasi perbandingan hasil voting</p>
                    </div>

                    {data.length > 0 ? (
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={data}
                                    margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
                                >
                                    <defs>
                                        <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="nameKetua"
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        label={{
                                            value: "Kandidat Ketua",
                                            position: "insideBottom",
                                            offset: -10,
                                            style: { fill: "#374151", fontWeight: 600 }
                                        }}
                                    />
                                    <YAxis
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                        label={{
                                            value: "Jumlah Suara",
                                            angle: -90,
                                            position: "insideLeft",
                                            style: { fill: "#374151", fontWeight: 600 }
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#FFFFFF",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "12px",
                                            padding: "12px",
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                        }}
                                        labelStyle={{ fontWeight: 600, color: "#111827" }}
                                    />
                                    <Bar
                                        dataKey="totalVotes"
                                        fill="url(#colorVotes)"
                                        radius={[8, 8, 0, 0]}
                                        maxBarSize={80}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Grafik Belum Tersedia</h3>
                            <p className="text-gray-500">Grafik akan muncul setelah ada data voting yang masuk</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}