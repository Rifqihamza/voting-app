import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Ambil semua user kecuali admin
        const users = await prisma.user.findMany({
            where: {
                role: { not: "ADMIN" },
            },
            select: {
                id: true,
                name: true,
                nis: true,
                kelas: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                votes: true,
            },
            orderBy: { createdAt: "asc" },
        })

        // Tambahkan properti `hasVoted`
        const participants = users.map((user) => ({
            id: user.id,
            name: user.name,
            nis: user.nis,
            kelas: user.kelas,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role,
            hasVoted: user.votes.length > 0,
        }))

        return NextResponse.json(participants)
    } catch (error) {
        console.error("Error fetching participants:", error)
        return NextResponse.json(
            { error: "Gagal memuat data peserta" },
            { status: 500 }
        )
    }
}
