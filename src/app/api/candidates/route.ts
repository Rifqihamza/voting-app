import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const data = await prisma.candidate.findMany({ orderBy: { createdAt: "asc" } })
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    try {
        const { nameKetua, nameWakil, visi, misi, foto, electionId } = await req.json()
        if (!nameKetua || !nameWakil || !electionId)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })

        const newCandidate = await prisma.candidate.create({
            data: { nameKetua, nameWakil, visi, misi, foto, electionId: Number(electionId) },
        })
        return NextResponse.json(newCandidate)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to add candidate" }, { status: 500 })
    }
}
