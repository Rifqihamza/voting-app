import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await req.json()
        const updated = await prisma.candidate.update({
            where: { id: Number(id) },
            data: body,
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 })
    }
}
