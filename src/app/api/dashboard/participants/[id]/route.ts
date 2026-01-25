import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcryptjs from "bcryptjs"

const updateUserSchema = z.object({
    nis: z.string().min(4).optional(),
    name: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
    kelas: z.string().min(1).optional(),
    role: z.enum(['STUDENT', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = updateUserSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const updateData = parsed.data

        // If updating NIS, check uniqueness
        if (updateData.nis) {
            const existing = await prisma.user.findFirst({
                where: {
                    nis: updateData.nis,
                    id: { not: Number(params.id) }
                }
            })
            if (existing) {
                return NextResponse.json({ error: 'NIS sudah digunakan' }, { status: 400 })
            }
        }

        // Hash password if provided
        if (updateData.password) {
            updateData.password = await bcryptjs.hash(updateData.password, 12)
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(params.id) },
            data: updateData,
            select: {
                id: true,
                nis: true,
                name: true,
                kelas: true,
                role: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: { votes: true }
                }
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("PUT participant error:", error)
        return NextResponse.json({ error: "Gagal memperbarui peserta" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Soft delete by setting isActive to false
        const updatedUser = await prisma.user.update({
            where: { id: Number(params.id) },
            data: { isActive: false },
            select: {
                id: true,
                nis: true,
                name: true,
                kelas: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("DELETE participant error:", error)
        return NextResponse.json({ error: "Gagal menghapus peserta" }, { status: 500 })
    }
}