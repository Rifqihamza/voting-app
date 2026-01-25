import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const electionSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    isPublished: z.boolean().optional(),
})

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const elections = await prisma.election.findMany({
            orderBy: {
                startAt: "desc",
            },
        })
        return NextResponse.json({ success: true, data: elections })
    } catch (error) {
        console.error("GET elections error:", error)
        return NextResponse.json({ success: false, message: "Gagal mengambil data election" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = electionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const { startAt, endAt, ...data } = parsed.data
        const newElection = await prisma.election.create({
            data: {
                ...data,
                startAt: new Date(startAt),
                endAt: new Date(endAt),
            },
        })

        return NextResponse.json(newElection)
    } catch (error) {
        console.error("POST election error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
