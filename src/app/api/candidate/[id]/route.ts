import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateCandidateSchema = z.object({
    nameKetua: z.string().min(1).optional(),
    nameWakil: z.string().min(1).optional(),
    visi: z.string().optional(),
    misi: z.string().optional(),
    foto: z.string().optional(),
    isActive: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = updateCandidateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const updated = await prisma.candidate.update({
            where: { id: Number(params.id) },
            data: parsed.data,
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error("PUT candidate error:", error)
        return NextResponse.json({ error: "Gagal memperbarui kandidat" }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.candidate.update({
            where: { id: Number(params.id) },
            data: { isActive: false },
        }) // Soft delete
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE candidate error:", error)
        return NextResponse.json({ error: "Gagal menghapus kandidat" }, { status: 500 })
    }
}
