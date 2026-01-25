"use client"

import { useState } from "react"
import { Candidate } from "@/hook/useCandidate"
import { useElection } from "@/hook/useElection"
import Image from "next/image"
interface Props {
    onAdd: (candidate: Omit<Candidate, "id">) => Promise<void>
}

export default function CandidateForm({ onAdd }: Props) {
    const [formData, setFormData] = useState({
        nameKetua: "",
        nameWakil: "",
        visi: "",
        misi: "",
        foto: "",
        electionId: "",
    })
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const { elections, loading, error } = useElection()

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    // Upload foto
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string); // data URL
        };
        reader.readAsDataURL(file);

        setFormData(prev => ({ ...prev, foto: file.name }));

        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
        setUploading(true)

        try {
            const formDataUpload = new FormData()
            formDataUpload.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            })
            if (!res.ok) throw new Error("Upload gagal")

            const data = await res.json()
            setFormData((prev) => ({ ...prev, foto: data.url }))
            showToast("success", "Foto berhasil diupload ✅")
        } catch {
            setPreview(null)
            showToast("error", "Gagal mengupload foto ❌")
        } finally {
            setUploading(false)
        }
    }

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nameKetua || !formData.nameWakil || !formData.electionId) {
            showToast("error", "Nama ketua, wakil, dan election wajib diisi!")
            return
        }

        try {
            await onAdd({
                ...formData,
                electionId: Number(formData.electionId),
            } as Omit<Candidate, "id">)
            setFormData({
                nameKetua: "",
                nameWakil: "",
                visi: "",
                misi: "",
                foto: "",
                electionId: "",
            })
            setPreview(null)
            showToast("success", "Kandidat berhasil ditambahkan ✅")
        } catch {
            showToast("error", "Gagal menambahkan kandidat ❌")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-gray-100 relative">
            {/* Toast */}
            {toast && (
                <div className="toast toast-top toast-end z-50">
                    <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Tambah Kandidat Baru
                </h2>
                <p className="text-gray-500 text-sm mt-1">Lengkapi informasi kandidat di bawah ini</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom kiri */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label font-semibold text-gray-700">Nama Ketua</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama ketua"
                                className="input border border-gray-300 rounded-lg w-full bg-white"
                                value={formData.nameKetua}
                                onChange={(e) => setFormData({ ...formData, nameKetua: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label font-semibold text-gray-700">Nama Wakil</label>
                            <input
                                type="text"
                                placeholder="Masukkan nama wakil"
                                className="input border border-gray-300 rounded-lg w-full bg-white"
                                value={formData.nameWakil}
                                onChange={(e) => setFormData({ ...formData, nameWakil: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Dropdown election */}
                    <div>
                        <label className="label font-semibold  text-gray-700">Pilih Election</label>
                        {error && <p className="text-sm text-red-500 mb-2">Gagal memuat data election: {error}</p>}
                        <select
                            className="select border border-gray-300 px-4 rounded-lg w-full bg-white"
                            value={formData.electionId}
                            onChange={(e) => setFormData({ ...formData, electionId: e.target.value })}
                            required
                            disabled={loading}
                        >
                            <option value="">{loading ? "Memuat data..." : "Pilih election"}</option>
                            {elections.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upload foto */}
                    <div>
                        <label className="label font-semibold text-gray-700">Foto Kandidat</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-primary file-input-bordered rounded-lg w-full bg-white"
                            onChange={handleImageChange}
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="flex items-center gap-2 mt-2 text-blue-600">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span className="text-sm">Mengupload foto...</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="label font-semibold text-gray-700">Visi</label>
                        <textarea
                            placeholder="Tuliskan visi..."
                            className="textarea border border-gray-300 rounded-lg w-full bg-white h-24 resize-none"
                            value={formData.visi}
                            onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label font-semibold text-gray-700">Misi</label>
                        <textarea
                            placeholder="Tuliskan misi..."
                            className="textarea border border-gray-300 rounded-lg w-full bg-white h-32 resize-none"
                            value={formData.misi}
                            onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                        />
                    </div>
                </div>

                {/* Kolom kanan - Preview foto */}
                <div className="lg:col-span-1">
                    <label className="label font-semibold text-gray-700">Preview Foto</label>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                        {preview ? (
                            <Image
                                src={preview}          // blob URL
                                alt={preview}
                                fill
                                className="object-cover rounded-2xl mx-auto"
                                unoptimized            // penting agar Next.js tidak optimasi
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg
                                    className="w-14 h-14 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p>Belum ada foto</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto px-8 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={uploading || loading}
                >
                    {uploading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            <span>Mengupload...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Kandidat
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
