import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: "Election ID is required" }, { status: 400 })

        // Nonaktifkan semua election lain
        await prisma.election.updateMany({
            data: { isPublished: false },
        })

        // Aktifkan election ini
        const startedElection = await prisma.election.update({
            where: { id },
            data: { isPublished: true },
        })

        return NextResponse.json(startedElection)
    } catch (error) {
        console.error("Error starting election:", error)
        return NextResponse.json({ error: "Failed to start election" }, { status: 500 })
    }
}
