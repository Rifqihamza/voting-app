// src/app/api/vote/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session || !session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { candidateId, electionId } = body

        if (!candidateId || !electionId) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 })
        }

        const userId = Number(session.user.id)

        // cek kalau sudah vote
        const existing = await prisma.vote.findFirst({
            where: { userId, electionId: Number(electionId) },
        })

        if (existing) {
            return NextResponse.json({ success: false, message: "Kamu sudah melakukan vote untuk election ini." }, { status: 400 })
        }

        await prisma.vote.create({
            data: {
                userId,
                candidateId: Number(candidateId),
                electionId: Number(electionId),
            },
        })

        return NextResponse.json({ success: true, message: "Vote berhasil!" })
    } catch (err: unknown) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Terjadi kesalahan server"
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}
