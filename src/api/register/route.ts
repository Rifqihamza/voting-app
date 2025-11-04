import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const body = await req.json()
    const { nis, name, password, kelas } = body

    if (!nis || !name || !password || !kelas) {
        return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { nis } })
    if (existing) {
        return NextResponse.json({ message: 'NIS sudah terdaftar' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            nis,
            name,
            password: hashedPassword,
            kelas,
            role: 'USER',
            isActive: true,
        },
    })

    return NextResponse.json({ message: 'Berhasil daftar' }, { status: 200 })
}