import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcryptjs from "bcryptjs"

const createUserSchema = z.object({
    nis: z.string().min(4, 'NIS minimal 4 karakter'),
    name: z.string().min(1, 'Nama wajib diisi'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    kelas: z.string().min(1, 'Kelas wajib diisi'),
    role: z.enum(['STUDENT', 'ADMIN']).optional().default('STUDENT'),
})

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''

        const skip = (page - 1) * limit

        const where = search
            ? {
                OR: [
                    { nis: { contains: search } },
                    { name: { contains: search } },
                    { kelas: { contains: search } },
                ],
            }
            : {}

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
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
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("GET participants error:", error)
        return NextResponse.json({ error: "Gagal mengambil data peserta" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = createUserSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const { password, ...data } = parsed.data

        const existing = await prisma.user.findUnique({ where: { nis: data.nis } })
        if (existing) {
            return NextResponse.json({ error: 'NIS sudah terdaftar' }, { status: 400 })
        }

        const hashedPassword = await bcryptjs.hash(password, 12)

        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                isActive: true,
            },
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

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error("POST participant error:", error)
        return NextResponse.json({ error: "Gagal menambah peserta" }, { status: 500 })
    }
}