import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const voteSchema = z.object({
    candidateId: z.number().int().positive(),
    electionId: z.number().int().positive(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = voteSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const { candidateId, electionId } = parsed.data
        const userId = Number(session.user.id)

        // Check if user has already voted in this election
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_electionId: {
                    userId,
                    electionId,
                },
            },
        })

        if (existingVote) {
            return NextResponse.json({ error: "Anda sudah memilih di pemilihan ini" }, { status: 400 })
        }

        // Check if election is active
        const election = await prisma.election.findUnique({
            where: { id: electionId },
        })

        if (!election || !election.isPublished) {
            return NextResponse.json({ error: "Pemilihan tidak aktif" }, { status: 400 })
        }

        const now = new Date()
        if (now < election.startAt || now > election.endAt) {
            return NextResponse.json({ error: "Pemilihan belum dimulai atau sudah berakhir" }, { status: 400 })
        }

        // Check if candidate exists and is active
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
        })

        if (!candidate || !candidate.isActive || candidate.electionId !== electionId) {
            return NextResponse.json({ error: "Kandidat tidak valid" }, { status: 400 })
        }

        // Create vote
        await prisma.vote.create({
            data: {
                userId,
                candidateId,
                electionId,
            },
        })

        // Log the vote
        await prisma.loginHistory.create({
            data: {
                userId,
                success: true,
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
                userAgent: req.headers.get('user-agent') || 'unknown',
            },
        })

        return NextResponse.json({ message: "Vote berhasil" }, { status: 200 })
    } catch (error) {
        console.error("Vote error:", error)
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
    }
}