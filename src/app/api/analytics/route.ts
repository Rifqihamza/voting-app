import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get election statistics
        const elections = await prisma.election.findMany({
            include: {
                _count: {
                    select: { candidates: true, votes: true }
                },
                candidates: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        // Get voting patterns over time
        interface VoteStatsRaw {
            date: Date
            votes: bigint
        }
        const voteStatsRaw = await prisma.$queryRaw<VoteStatsRaw[]>`
            SELECT
                DATE(v.createdAt) as date,
                COUNT(*) as votes
            FROM Vote v
            GROUP BY DATE(v.createdAt)
            ORDER BY date DESC
            LIMIT 30
        `
        const voteStats = voteStatsRaw.map(stat => ({
            date: stat.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD string
            votes: Number(stat.votes)
        }))

        // Get candidate performance
        const candidateStats = await prisma.candidate.findMany({
            include: {
                _count: {
                    select: { votes: true }
                },
                election: {
                    select: { title: true }
                }
            },
            orderBy: {
                votes: {
                    _count: 'desc'
                }
            },
            take: 10
        })

        // Get user activity stats
        const userActivity = await prisma.user.groupBy({
            by: ['kelas'],
            _count: {
                _all: true
            },
            where: {
                isActive: true
            }
        })

        // Get participation by class
        interface ClassParticipationRaw {
            kelas: string | null
            total_students: bigint
            voted_students: bigint
        }
        const classParticipationRaw = await prisma.$queryRaw<ClassParticipationRaw[]>`
            SELECT
                u.kelas,
                COUNT(DISTINCT u.id) as total_students,
                COUNT(DISTINCT CASE WHEN v.id IS NOT NULL THEN u.id END) as voted_students
            FROM User u
            LEFT JOIN Vote v ON u.id = v.userId
            WHERE u.isActive = true AND u.role = 'STUDENT'
            GROUP BY u.kelas
            ORDER BY u.kelas
        `
        const classParticipation = classParticipationRaw.map(item => ({
            kelas: item.kelas,
            total_students: Number(item.total_students),
            voted_students: Number(item.voted_students)
        }))

        return NextResponse.json({
            elections,
            voteStats,
            candidateStats,
            userActivity,
            classParticipation
        })
    } catch (error) {
        console.error("Analytics error:", error)
        return NextResponse.json({ error: "Gagal memuat data analitik" }, { status: 500 })
    }
}