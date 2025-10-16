// src/app/api/vote/check/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({ hasVoted: false, authenticated: false })
    }
    const userId = Number(session.user.id)
    const electionId = Number(req.nextUrl.searchParams.get("electionId") ?? 0)
    if (!electionId) {
        return NextResponse.json({ error: "electionId required" }, { status: 400 })
    }

    const vote = await prisma.vote.findFirst({
        where: { userId, electionId },
    })

    return NextResponse.json({ authenticated: true, hasVoted: !!vote })
}
