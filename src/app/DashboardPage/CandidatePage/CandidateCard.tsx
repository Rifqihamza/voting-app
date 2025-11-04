"use client"

import Image from "next/image"
import { Candidate } from "../../../hooks/useCandidate"

interface Props {
    candidate: Candidate
    onClick: () => void
}

export default function CandidateCard({ candidate, onClick }: Props) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
        }
    }

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${candidate.nameKetua} and ${candidate.nameWakil}`}
        >
            {/* Card Shadow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300" />

            {/* Border Gradient on Hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300"
                style={{
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, transparent, transparent) border-box'
                }}
            />

            <div className="relative shadow-lg group-hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-100">
                {/* Image Container with Overlay */}
                <div className="h-80 w-full relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {candidate.foto ? (
                        <>
                            <Image
                                src={candidate.foto}
                                alt={`${candidate.nameKetua} & ${candidate.nameWakil}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-20 h-20 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-400 text-sm">No Image</p>
                            </div>
                        </div>
                    )}

                    {/* Badge Number (Optional - you can pass candidate number as prop) */}
                    <div className="absolute top-1 right-2 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full shadow-lg">
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            CALON
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 bg-white relative">
                    {/* Decorative Element */}
                    <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />

                    <div className="mt-2 space-y-3">
                        {/* Ketua */}
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ketua</p>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                {candidate.nameKetua}
                            </h2>
                        </div>

                        {/* Wakil */}
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Wakil Ketua</p>
                            <h3 className="text-lg font-semibold text-gray-700">
                                {candidate.nameWakil}
                            </h3>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-3" />

                        {/* Visi */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-bold text-gray-700">Visi</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {candidate.visi || "Tidak ada visi yang tersedia"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-bold text-gray-700">Misi</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {candidate.misi || "Tidak ada misi yang tersedia"}
                            </p>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-2">
                            <div className="flex items-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                                <span className="text-sm font-semibold">Lihat Detail</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}