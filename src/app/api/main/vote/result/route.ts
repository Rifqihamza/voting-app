// src/app/api/vote/results/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const electionId = Number(req.nextUrl.searchParams.get("electionId") ?? 0)
    if (!electionId) {
        return NextResponse.json({ error: "electionId required" }, { status: 400 })
    }

    const results = await prisma.candidate.findMany({
        where: { electionId },
        select: {
            id: true,
            nameKetua: true,
            nameWakil: true,
            votes: { select: { id: true } },
        },
    })

    const mapped = results.map((r) => ({ id: r.id, name: `${r.nameKetua} & ${r.nameWakil}`, votes: r.votes.length }))
    return NextResponse.json({ results: mapped })
}
