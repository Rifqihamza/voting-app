"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileDown } from "lucide-react"
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

    if (loading)
        return (
            <p className="text-center mt-10 text-gray-500">Memuat data analitik...</p>
        )

    if (!data.length)
        return (
            <p className="text-center mt-10 text-gray-400">
                Belum ada data hasil voting.
            </p>
        )

    return (
        <section className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-violet-600">
                        Analisis Hasil Pemilihan
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan hasil suara untuk setiap kandidat
                    </p>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <FileDown size={18} /> Export Excel
                </button>
            </div>

            {/* Tabel Data */}
            <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
                <table className="w-full text-sm text-gray-700">
                    <thead className="bg-violet-100 text-violet-700">
                        <tr>
                            <th className="py-3 px-4 border-b border-violet-200 ">No</th>
                            <th className="py-3 px-4 border-b border-violet-200 text-left">Ketua</th>
                            <th className="py-3 px-4 border-b border-violet-200 text-left">Wakil</th>
                            <th className="py-3 px-4 border-b border-violet-200 text-center">Jumlah Suara</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((c, index) => (
                            <tr
                                key={c.id}
                                className="hover:bg-gray-50 border-b border-gray-200 last:border-none"
                            >
                                <td className="py-3 px-4 text-center">{index + 1}</td>
                                <td className="py-3 px-4">{c.nameKetua}</td>
                                <td className="py-3 px-4">{c.nameWakil}</td>
                                <td className="py-3 px-4 text-center font-semibold text-violet-600">
                                    {c.totalVotes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grafik Bar */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Grafik Perolehan Suara
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="nameKetua"
                            tick={{ fill: "#6B7280" }}
                            label={{
                                value: "Kandidat Ketua",
                                position: "bottom",
                                offset: 10,
                            }}
                        />
                        <YAxis
                            tick={{ fill: "#6B7280" }}
                            label={{
                                value: "Jumlah Suara",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                            }}
                        />
                        <Tooltip />
                        <Bar dataKey="totalVotes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}
