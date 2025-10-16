// app/api/overview/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const participants = await prisma.user.count({
            where: { role: { not: "ADMIN" } },
        })

        const candidates = await prisma.candidate.count()
        const votes = await prisma.vote.count()

        // Cek apakah ada election aktif
        const currentElection = await prisma.election.findFirst({
            where: {
                startAt: { lte: new Date() },
                endAt: { gte: new Date() },
            },
        })

        return NextResponse.json({
            participants,
            candidates,
            votes,
            status: currentElection ? "Sedang Berlangsung" : "Tidak Aktif",
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Gagal mengambil data overview" },
            { status: 500 }
        )
    }
}
