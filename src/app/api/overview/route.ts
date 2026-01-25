import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Count participants (active users)
        const participants = await prisma.user.count({ where: { isActive: true } })

        // Count candidates (active)
        const candidates = await prisma.candidate.count({ where: { isActive: true } })

        // Count votes
        const votes = await prisma.vote.count()

        // Election status
        const now = new Date()
        const election = await prisma.election.findFirst({
            where: {
                OR: [
                    { startAt: { lte: now }, endAt: { gte: now } },
                    { endAt: { lt: now } }
                ]
            },
            orderBy: { startAt: "desc" }
        })

        let status = "Tidak ada Pemilihan"
        if (election) {
            if (election.startAt <= now && election.endAt >= now && election.isPublished) {
                status = "Sedang Berlangsung"
            } else if (election.endAt < now) {
                status = "Selesai"
            } else {
                status = "Akan Datang"
            }
        }

        return NextResponse.json({ participants, candidates, votes, status })
    } catch (error) {
        console.error("Error fetching overview:", error)
        return NextResponse.json({ error: "Gagal memuat data overview" }, { status: 500 })
    }
}
