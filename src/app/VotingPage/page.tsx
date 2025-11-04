"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCandidates } from "@/hook/useCandidate"
import { useEffect } from "react" // Diperlukan untuk side effect
import Image from "next/image"
import Link from "next/link"

export default function VotingPage() {
    // Asumsi: useCandidates() mengembalikan data dengan format yang sesuai skema Candidate
    const { candidates, loading, error } = useCandidates()

    const { data: session, status } = useSession()
    const router = useRouter()

    // FIX: Memindahkan logika redirect ke dalam useEffect
    useEffect(() => {
        // Jangan jalankan apa-apa saat status masih 'loading'
        if (status === "loading") return

        if (!session) {
            // Pengguna tidak terotentikasi: redirect ke login
            // Menggunakan replace agar halaman voting yang gagal diakses tidak ada di history
            router.replace("/Authentication/login")
        } else if (session.user.role !== "STUDENT") {
            // Pengguna bukan student (misal: admin): redirect ke admin page
            router.replace("/dashboard") // Menggunakan /dashboard sesuai pola sebelumnya
        }
    }, [status, session, router]) // Dependensi: status, session, dan router

    // 1. Tampilkan pesan status saat otentikasi sedang berlangsung
    // atau jika redirect akan segera terjadi (karena !session atau role salah)
    if (status === "loading" || !session || session.user.role !== "STUDENT") {
        return (
            <div className="flex justify-center items-center min-h-[100dvh]">
                <p className="text-lg font-medium text-gray-600">Checking access and session status...</p>
            </div>
        )
    }

    // 2. Tampilkan status loading atau error kandidat setelah otentikasi berhasil
    if (loading) return <p className="text-center mt-10">Loading daftar kandidat...</p>
    if (error) return <p className="text-center mt-10 text-red-600">Error loading candidates: {error}</p>

    return (
        <main className="w-full max-w-6xl flex flex-col items-center justify-center mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-around items-center gap-10 w-full">
                {candidates.map((c) => (
                    <Link
                        key={c.id}
                        href={`/voting/${c.id}`}
                        title={c.nameKetua}
                        className="hover:scale-105 duration-300"
                    >
                        <h1 className="font-bold text-violet-500 text-center">{c.nameKetua} & {c.nameWakil}</h1>
                        <p className="text-center font-semibold uppercase tracking-wide mb-2">Paslon {c.id}</p>
                        {/* Menambahkan foto jika ada */}
                        <Image
                            src={c.foto}
                            width={500}
                            height={500}
                            alt={`Foto Paslon ${c.nameKetua}`}
                            className="w-96 h-96 object-contain"
                            // Placeholder image jika URL foto tidak valid
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://placehold.co/600x400/8b5cf6/ffffff?text=Paslon+Foto"
                            }}
                        />
                    </Link>
                ))}
            </div>
        </main>
    )
}
