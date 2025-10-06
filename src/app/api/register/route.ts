import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { nis, name, password, kelas } = await req.json()

        if (!nis || !password || !name) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { nis } })
        if (existing) {
            return NextResponse.json({ error: "NIS sudah terdaftar" }, { status: 400 })
        }

        const hashedPassword = await hash(password, 10)
        await prisma.user.create({
            data: {
                nis,
                name,
                password: hashedPassword,
                kelas,
                role: "STUDENT",
            },
        })

        return NextResponse.json({ message: "Register sukses" })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
    }
}
