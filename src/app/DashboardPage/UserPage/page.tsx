"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react"

interface Participant {
    id: number
    name: string
    nis: string
    role: string
    kelas: string
    isActive: boolean
    createdAt: string
    _count?: {
        votes: number
    }
}

interface PaginationData {
    page: number
    limit: number
    total: number
    pages: number
}

export default function ParticipantDashboard() {
    const [participants, setParticipants] = useState<Participant[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)

    const fetchParticipants = async (page = 1, searchTerm = "", showRefresh = false) => {
        if (showRefresh) setRefreshing(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm })
            })
            const res = await fetch(`/api/dashboard/participants?${params}`)
            if (!res.ok) throw new Error("Gagal mengambil data peserta")
            const result = await res.json()

            // Filter agar admin tidak ditampilkan
            const filtered = result.data.filter((p: Participant) => p.role !== "ADMIN")
            setParticipants(filtered)
            setPagination(result.pagination)
            setCurrentPage(page)
        } catch (err) {
            console.error(err)
            setError("Terjadi kesalahan saat mengambil data peserta")
        } finally {
            setLoading(false)
            if (showRefresh) setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchParticipants()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchParticipants(1, search)
    }

    const handlePageChange = (page: number) => {
        fetchParticipants(page, search)
    }

    const handleRefresh = () => {
        fetchParticipants(currentPage, search, true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus peserta ini?')) return

        try {
            const res = await fetch(`/api/dashboard/participants/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error("Gagal menghapus peserta")
            fetchParticipants(currentPage, search)
        } catch (err) {
            console.error(err)
            alert("Gagal menghapus peserta")
        }
    }

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        )

    if (error)
        return (
            <div className="text-center mt-10">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => fetchParticipants(currentPage, search)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                    Coba Lagi
                </button>
            </div>
        )

    return (
        <main className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-violet-600">Daftar Peserta</h1>
                    <p className="text-gray-600">Kelola data peserta pemilihan</p>
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
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Peserta
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIS, atau kelas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                        Cari
                    </button>
                </form>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Peserta</p>
                            <p className="text-2xl font-bold text-violet-600">{pagination?.total || 0}</p>
                        </div>
                        <div className="p-3 bg-violet-100 rounded-lg">
                            <Search className="w-6 h-6 text-violet-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Sudah Vote</p>
                            <p className="text-2xl font-bold text-green-600">
                                {participants.filter(p => (p._count?.votes || 0) > 0).length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Trash2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Belum Vote</p>
                            <p className="text-2xl font-bold text-red-600">
                                {participants.filter(p => (p._count?.votes || 0) === 0).length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Plus className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-violet-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">No</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Nama</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">NIS</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Kelas</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Dibuat</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">Status Voting</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-12 h-12 text-gray-300 mb-4" />
                                            <p>Tidak ada peserta ditemukan.</p>
                                            {search && (
                                                <p className="text-sm mt-1">Coba ubah kata kunci pencarian.</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                participants.map((p, index) => {
                                    const hasVoted = (p._count?.votes || 0) > 0
                                    const rowNumber = (currentPage - 1) * 10 + index + 1
                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-violet-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-gray-700 text-sm">{rowNumber}</td>
                                            <td className="px-6 py-4 text-gray-800 font-medium">{p.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{p.nis}</td>
                                            <td className="px-6 py-4 text-gray-600">{p.kelas || "-"}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(p.createdAt).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${hasVoted
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-2 h-2 rounded-full mr-2 ${hasVoted ? "bg-green-500" : "bg-red-500"}`}
                                                    ></span>
                                                    {hasVoted ? "Sudah Vote" : "Belum Vote"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingParticipant(p)
                                                            setShowModal(true)
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} hasil
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                        const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i
                                        if (pageNum > pagination.pages) return null
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 text-sm border rounded-lg ${pagination.page === pageNum
                                                    ? 'bg-violet-600 text-white border-violet-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Participant Modal */}
            {showModal && (
                <ParticipantModal
                    participant={editingParticipant}
                    onClose={() => {
                        setShowModal(false)
                        setEditingParticipant(null)
                    }}
                    onSuccess={() => {
                        setShowModal(false)
                        setEditingParticipant(null)
                        fetchParticipants(currentPage, search)
                    }}
                />
            )}
        </main>
    )
}

// Participant Modal Component
function ParticipantModal({
    participant,
    onClose,
    onSuccess
}: {
    participant: Participant | null
    onClose: () => void
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        nis: participant?.nis || '',
        name: participant?.name || '',
        password: '',
        kelas: participant?.kelas || '',
        role: participant?.role || 'STUDENT'
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.nis.trim()) newErrors.nis = 'NIS wajib diisi'
        else if (formData.nis.length < 4) newErrors.nis = 'NIS minimal 4 karakter'

        if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'

        if (!participant && !formData.password) newErrors.password = 'Password wajib diisi'
        else if (!participant && formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter'

        if (!formData.kelas.trim()) newErrors.kelas = 'Kelas wajib diisi'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const submitData = {
                ...formData,
                ...(formData.password ? { password: formData.password } : {})
            }

            const url = participant
                ? `/api/dashboard/participants/${participant.id}`
                : '/api/dashboard/participants'

            const method = participant ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Terjadi kesalahan')
            }

            onSuccess()
        } catch (error) {
            console.error('Submit error:', error)
            alert(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {participant ? 'Edit Peserta' : 'Tambah Peserta'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            NIS *
                        </label>
                        <input
                            type="text"
                            value={formData.nis}
                            onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.nis ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Masukkan NIS"
                        />
                        {errors.nis && <p className="text-red-500 text-sm mt-1">{errors.nis}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {!participant && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Masukkan password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                    )}

                    {participant && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password Baru (kosongkan jika tidak diubah)
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                placeholder="Masukkan password baru"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kelas *
                        </label>
                        <input
                            type="text"
                            value={formData.kelas}
                            onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.kelas ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Contoh: 12A, 11B"
                        />
                        {errors.kelas && <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                            {participant ? 'Update' : 'Tambah'} Peserta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
