import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
const registerSchema = z.object({
    nis: z.string().min(4, 'NIS minimal 4 karakter'),
    name: z.string().min(1, 'Nama wajib diisi'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    kelas: z.string().min(1, 'Kelas wajib diisi'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = registerSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ message: 'Data tidak valid', errors: parsed.error.issues }, { status: 400 })
        }

        const { nis, name, password, kelas } = parsed.data

        const existing = await prisma.user.findUnique({ where: { nis } })
        if (existing) {
            return NextResponse.json({ message: 'NIS sudah terdaftar' }, { status: 400 })
        }

        const hashedPassword = await bcryptjs.hash(password, 12) // Increased salt rounds

        await prisma.user.create({
            data: {
                nis,
                name,
                password: hashedPassword,
                kelas,
                role: 'STUDENT',
                isActive: true,
            },
        })

        return NextResponse.json({ message: 'Berhasil daftar' }, { status: 200 })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
    }
}
