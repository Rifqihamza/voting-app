"use client"

import { useState } from "react"
import Image from "next/image"
import { Candidate } from "../../../hooks/useCandidate"

interface Props {
    candidate: Candidate | null
    onClose: () => void
    onSave: (candidate: Candidate) => Promise<void>
}

export default function CandidateModal({ candidate, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<Candidate>(candidate || {} as Candidate)
    const [isLoading, setIsLoading] = useState(false)
    const [imageError, setImageError] = useState(false)

    if (!candidate) return null

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await onSave(formData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (field: keyof Candidate, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'foto') setImageError(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-slideUp">
                {/* Header with Gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-5 py-2">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative flex items-center justify-between">
                        <div className="px-2">
                            <h3 className="text-xl font-bold text-white">Edit Kandidat</h3>
                            <p className="text-blue-100 text-sm">Perbarui informasi calon kandidat</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 group"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Preview */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Preview Foto
                                </label>
                                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200">
                                    {formData.foto && !imageError ? (
                                        <Image
                                            src={formData.foto}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-20 h-20 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-400 text-sm">Foto akan muncul di sini</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">Tips</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Gunakan foto berkualitas tinggi</li>
                                            <li>• Pastikan visi & misi jelas dan ringkas</li>
                                            <li>• URL foto harus dapat diakses publik</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="space-y-6">
                            {/* Ketua */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Nama Ketua
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
                                    placeholder="Masukkan nama ketua"
                                    value={formData.nameKetua}
                                    onChange={(e) => handleChange('nameKetua', e.target.value)}
                                />
                            </div>

                            {/* Wakil */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Nama Wakil Ketua
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white"
                                    placeholder="Masukkan nama wakil ketua"
                                    value={formData.nameWakil}
                                    onChange={(e) => handleChange('nameWakil', e.target.value)}
                                />
                            </div>

                            {/* Foto URL */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    URL Foto
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors duration-200 bg-white"
                                    placeholder="https://example.com/foto.jpg"
                                    value={formData.foto ?? ""}
                                    onChange={(e) => handleChange('foto', e.target.value)}
                                />
                                {imageError && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        URL foto tidak valid
                                    </p>
                                )}
                            </div>

                            {/* Visi */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Visi
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white resize-none"
                                    placeholder="Tuliskan visi kandidat..."
                                    rows={3}
                                    value={formData.visi ?? ""}
                                    onChange={(e) => handleChange('visi', e.target.value)}
                                />
                            </div>

                            {/* Misi */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Misi
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-colors duration-200 bg-white resize-none"
                                    placeholder="Tuliskan misi kandidat..."
                                    rows={4}
                                    value={formData.misi ?? ""}
                                    onChange={(e) => handleChange('misi', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-1 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-1 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}