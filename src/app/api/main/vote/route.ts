import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
    limitKey,
    rateLimitCheck,
    getClientIp,
    createRateLimitResponse,
    RateLimitPresets,
} from "../../../../lib/ratelimit"

export async function POST(req: Request) {
    try {
        // 1. Check authentication
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. Silakan login terlebih dahulu." },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // 2. Rate limiting check
        const ipAddress = getClientIp(req)
        const rateLimitKey = limitKey(`vote:${userId}`, ipAddress)
        const rateLimit = rateLimitCheck(rateLimitKey, RateLimitPresets.VOTING)

        if (!rateLimit.allowed) {
            return createRateLimitResponse(
                rateLimit.retryAfter || 300,
                "Anda sudah melakukan voting. Coba lagi nanti."
            )
        }

        // 3. Parse request body
        const body = await req.json()
        const { candidateId, electionId } = body

        if (!candidateId || !electionId) {
            return NextResponse.json(
                { error: "candidateId dan electionId wajib diisi" },
                { status: 400 }
            )
        }

        // 4. Check if user already voted
        const existingVote = await prisma.vote.findFirst({
            where: {
                userId,
                electionId: Number(electionId),
            },
        })

        if (existingVote) {
            return NextResponse.json(
                { error: "Anda sudah melakukan voting untuk pemilihan ini" },
                { status: 400 }
            )
        }

        // 5. Verify candidate exists and belongs to this election
        const candidate = await prisma.candidate.findFirst({
            where: {
                id: Number(candidateId),
                electionId: Number(electionId),
            },
        })

        if (!candidate) {
            return NextResponse.json(
                { error: "Kandidat tidak ditemukan" },
                { status: 404 }
            )
        }

        // 6. Create vote
        const vote = await prisma.vote.create({
            data: {
                userId,
                candidateId: Number(candidateId),
                electionId: Number(electionId),
            },
        })

        // 7. Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Vote berhasil disimpan",
                data: vote,
            },
            {
                status: 201,
                headers: {
                    "X-RateLimit-Remaining": rateLimit.remaining.toString(),
                },
            }
        )
    } catch (error) {
        console.error("Vote error:", error)
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan vote" },
            { status: 500 }
        )
    }
}

// GET method untuk cek apakah user sudah vote
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const electionId = searchParams.get("electionId")

        if (!electionId) {
            return NextResponse.json(
                { error: "electionId wajib diisi" },
                { status: 400 }
            )
        }

        const vote = await prisma.vote.findFirst({
            where: {
                userId: session.user.id,
                electionId: Number(electionId),
            },
            include: {
                candidate: {
                    select: {
                        id: true,
                        nameKetua: true,
                        nameWakil: true,
                    },
                },
            },
        })

        return NextResponse.json({
            hasVoted: !!vote,
            vote: vote || null,
        })
    } catch (error) {
        console.error("Get vote error:", error)
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 }
        )
    }
}