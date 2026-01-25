import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const candidateSchema = z.object({
    electionId: z.number().int().positive(),
    nameKetua: z.string().min(1),
    nameWakil: z.string().min(1),
    visi: z.string().optional(),
    misi: z.string().optional(),
    foto: z.string().optional(),
})

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const electionId = searchParams.get("electionId")

        const candidates = electionId
            ? await prisma.candidate.findMany({ where: { electionId: Number(electionId), isActive: true } })
            : await prisma.candidate.findMany({ where: { isActive: true } })

        return NextResponse.json(candidates)
    } catch (error) {
        console.error("GET candidates error:", error)
        return NextResponse.json({ error: "Gagal mengambil data kandidat" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = candidateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const newCandidate = await prisma.candidate.create({ data: parsed.data })
        return NextResponse.json(newCandidate)
    } catch (error) {
        console.error("POST candidate error:", error)
        return NextResponse.json({ error: "Gagal menambahkan kandidat" }, { status: 500 })
    }
}
