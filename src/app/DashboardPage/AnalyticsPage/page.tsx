"use client"

import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from "recharts"
import { TrendingUp, Users, Vote, Calendar, RefreshCw, Download } from "lucide-react"
import * as XLSX from 'xlsx'

interface Election {
    id: number
    title: string
    description: string
    startAt: string
    endAt: string
    isPublished: boolean
    createdAt: string
    _count: {
        candidates: number
        votes: number
    }
}

interface CandidateStat {
    id: number
    nameKetua: string
    nameWakil: string
    _count: {
        votes: number
    }
    election: {
        title: string
    }
}

interface VoteStat {
    date: string
    votes: number
}

interface UserActivity {
    kelas: string | null
    _count: {
        _all: number
    }
}

interface ClassParticipation {
    kelas: string | null
    total_students: number
    voted_students: number
}

interface AnalyticsData {
    elections: Election[]
    voteStats: VoteStat[]
    candidateStats: CandidateStat[]
    userActivity: UserActivity[]
    classParticipation: ClassParticipation[]
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchAnalytics = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true)
        try {
            const res = await fetch("/api/analytics")
            const analyticsData = await res.json()
            setData(analyticsData)
        } catch (error) {
            console.error("Gagal memuat data analitik:", error)
        } finally {
            setLoading(false)
            if (showRefresh) setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const handleRefresh = () => {
        fetchAnalytics(true)
    }

    const handleExport = () => {
        if (!data) return

        // Create workbook
        const wb = XLSX.utils.book_new()

        // Add summary sheet
        const summaryData = [
            ['Analytics Report'],
            ['Generated on:', new Date().toLocaleString('id-ID')],
            [''],
            ['Summary Statistics'],
            ['Total Elections:', data.elections.length],
            ['Total Candidates:', data.candidateStats.length],
            ['Total Votes:', data.candidateStats.reduce((sum, c) => sum + c._count.votes, 0)],
            ['Average Participation:', `${participationData.length > 0 ? Math.round(participationData.reduce((sum, item) => sum + item.percentage, 0) / participationData.length) : 0}%`],
            ['']
        ]

        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary')

        // Elections sheet
        const electionsHeaders = [['Election Title', 'Description', 'Candidates', 'Votes', 'Status', 'Created Date']]
        const electionsData = data.elections.map(election => [
            election.title,
            election.description,
            election._count.candidates,
            election._count.votes,
            election.isPublished ? 'Active' : 'Draft',
            new Date(election.createdAt).toLocaleDateString('id-ID')
        ])
        const electionsWS = XLSX.utils.aoa_to_sheet([...electionsHeaders, ...electionsData])
        XLSX.utils.book_append_sheet(wb, electionsWS, 'Elections')

        // Candidates sheet
        const candidatesHeaders = [['Candidate Name', 'Vice Candidate', 'Election', 'Votes']]
        const candidatesData = data.candidateStats.map(candidate => [
            candidate.nameKetua,
            candidate.nameWakil,
            candidate.election.title,
            candidate._count.votes
        ])
        const candidatesWS = XLSX.utils.aoa_to_sheet([...candidatesHeaders, ...candidatesData])
        XLSX.utils.book_append_sheet(wb, candidatesWS, 'Candidates')

        // Class Participation sheet
        const participationHeaders = [['Class', 'Total Students', 'Voted Students', 'Participation Rate']]
        const participationDataExport = data.classParticipation.map(item => {
            const rate = item.total_students > 0 ? Math.round((item.voted_students / item.total_students) * 100) : 0
            return [
                item.kelas || 'No Class',
                item.total_students,
                item.voted_students,
                `${rate}%`
            ]
        })
        const participationWS = XLSX.utils.aoa_to_sheet([...participationHeaders, ...participationDataExport])
        XLSX.utils.book_append_sheet(wb, participationWS, 'Participation')

        // Voting Timeline sheet
        const timelineHeaders = [['Date', 'Total Votes']]
        const timelineData = data.voteStats
            .slice()
            .reverse()
            .map(stat => [
                new Date(stat.date).toLocaleDateString('id-ID'),
                stat.votes
            ])
        const timelineWS = XLSX.utils.aoa_to_sheet([...timelineHeaders, ...timelineData])
        XLSX.utils.book_append_sheet(wb, timelineWS, 'Voting Timeline')

        // Class Distribution sheet
        const distributionHeaders = [['Class', 'Student Count']]
        const distributionData = data.userActivity
            .filter(item => item.kelas)
            .map(item => [
                item.kelas,
                item._count._all
            ])
        const distributionWS = XLSX.utils.aoa_to_sheet([...distributionHeaders, ...distributionData])
        XLSX.utils.book_append_sheet(wb, distributionWS, 'Class Distribution')

        // Style the worksheets (basic styling)
        const sheets = [summaryWS, electionsWS, candidatesWS, participationWS, timelineWS, distributionWS]

        sheets.forEach(sheet => {
            if (!sheet['!cols']) sheet['!cols'] = []
            // Auto-size columns
            const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')
            for (let col = range.s.c; col <= range.e.c; col++) {
                let maxWidth = 10 // minimum width
                for (let row = range.s.r; row <= range.e.r; row++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
                    const cell = sheet[cellAddress]
                    if (cell && cell.v) {
                        const cellValue = String(cell.v)
                        maxWidth = Math.max(maxWidth, cellValue.length)
                    }
                }
                sheet['!cols'][col] = { width: Math.min(maxWidth + 2, 50) } // max 50 chars
            }
        })

        // Generate and download the Excel file
        XLSX.writeFile(wb, `analytics-report-${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center mt-10">
                <p className="text-red-500 mb-4">Gagal memuat data analitik</p>
                <button
                    onClick={() => fetchAnalytics()}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                    Coba Lagi
                </button>
            </div>
        )
    }

    // Prepare chart data
    const participationData = data.classParticipation.map((item: ClassParticipation) => ({
        class: item.kelas || 'Tidak ada kelas',
        total: item.total_students,
        voted: item.voted_students,
        percentage: item.total_students > 0
            ? Math.round((item.voted_students / item.total_students) * 100)
            : 0
    }))

    const candidatePerformanceData = data.candidateStats.slice(0, 5).map((candidate: CandidateStat) => ({
        name: candidate.nameKetua,
        votes: candidate._count.votes,
        election: candidate.election.title
    }))

    const voteTimelineData = data.voteStats
        .slice()
        .reverse()
        .map((stat: VoteStat) => ({
            date: new Date(stat.date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit'
            }),
            votes: stat.votes
        }))

    const pieChartData = data.userActivity
        .filter((item: UserActivity) => item.kelas)
        .map((item: UserActivity) => ({
            name: item.kelas,
            value: item._count._all
        }))

    return (
        <main className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-violet-600">Analytics & Laporan</h1>
                    <p className="text-gray-600">Analisis mendalam data pemilihan</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Pemilihan</p>
                            <p className="text-3xl font-bold text-violet-600">{data.elections.length}</p>
                        </div>
                        <div className="p-3 bg-violet-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-violet-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Kandidat</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {data.candidateStats.length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Votes</p>
                            <p className="text-3xl font-bold text-green-600">
                                {data.candidateStats.reduce((sum, c) => sum + c._count.votes, 0)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Vote className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rata-rata Partisipasi</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {participationData.length > 0
                                    ? Math.round(participationData.reduce((sum, item) => sum + item.percentage, 0) / participationData.length)
                                    : 0}%
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Class Participation Chart */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Partisipasi per Kelas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={participationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="class" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [
                                    `${value}${name === 'percentage' ? '%' : ''}`,
                                    name === 'total' ? 'Total Siswa' :
                                        name === 'voted' ? 'Sudah Vote' : 'Persentase'
                                ]}
                            />
                            <Legend />
                            <Bar dataKey="total" fill="#8b5cf6" name="Total Siswa" />
                            <Bar dataKey="voted" fill="#10b981" name="Sudah Vote" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Vote Timeline */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline Voting (30 hari terakhir)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={voteTimelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="votes"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="Jumlah Vote"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Candidates */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kandidat Terpopuler</h3>
                    <div className="space-y-4">
                        {candidatePerformanceData.map((candidate, index) => (
                            <div key={candidate.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-500' : 'bg-violet-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{candidate.name}</p>
                                        <p className="text-sm text-gray-500">{candidate.election}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{candidate.votes}</p>
                                    <p className="text-sm text-gray-500">votes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Class Distribution */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Siswa per Kelas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Elections Table */}
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Pemilihan Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pemilihan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kandidat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Votes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dibuat
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.elections.map((election) => (
                                <tr key={election.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {election.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {election.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {election._count.candidates}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {election._count.votes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${election.isPublished
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {election.isPublished ? 'Aktif' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(election.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}