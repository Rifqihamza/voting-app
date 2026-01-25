import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateElectionSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startAt: z.string().datetime().optional(),
    endAt: z.string().datetime().optional(),
    isPublished: z.boolean().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const election = await prisma.election.findUnique({ where: { id: Number(params.id) } })
        if (!election) return NextResponse.json({ success: false, message: "Election tidak ditemukan" }, { status: 404 })
        return NextResponse.json({ success: true, data: election })
    } catch (error) {
        console.error("GET election error:", error)
        return NextResponse.json({ success: false, message: "Gagal mengambil election" }, { status: 500 })
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const body = await req.json()
        const parsed = updateElectionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const { startAt, endAt, ...data } = parsed.data
        const updateData = {
            ...data,
            ...(startAt && { startAt: new Date(startAt) }),
            ...(endAt && { endAt: new Date(endAt) }),
        }

        const updated = await prisma.election.update({
            where: { id: Number(id) },
            data: updateData,
        })
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error("PUT election error:", error)
        return NextResponse.json({ success: false, message: "Gagal memperbarui election" }, { status: 500 })
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        await prisma.election.delete({ where: { id: Number(id) } })
        return NextResponse.json({ success: true, message: "Election berhasil dihapus" })
    } catch (error) {
        console.error("DELETE election error:", error)
        return NextResponse.json({ success: false, message: "Gagal menghapus election" }, { status: 500 })
    }
}
