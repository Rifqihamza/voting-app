import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: "Election ID is required" }, { status: 400 })

        // Hapus semua vote dari election ini (jika pakai tabel vote)
        await prisma.vote.deleteMany({
            where: { electionId: id },
        })

        // Nonaktifkan election
        const resetElection = await prisma.election.update({
            where: { id },
            data: { isPublished: false },
        })

        return NextResponse.json(resetElection)
    } catch (error) {
        console.error("Error resetting election:", error)
        return NextResponse.json({ error: "Failed to reset election" }, { status: 500 })
    }
}
