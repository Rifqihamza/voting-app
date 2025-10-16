import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const candidates = await prisma.candidate.findMany({
            include: {
                _count: {
                    select: { votes: true },
                },
            },
        })

        const formatted = candidates.map((c) => ({
            id: c.id,
            nameKetua: c.nameKetua,
            nameWakil: c.nameWakil,
            totalVotes: c._count.votes,
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error("Error analytics:", error)
        return NextResponse.json(
            { message: "Gagal mengambil data analytics" },
            { status: 500 }
        )
    }
}
