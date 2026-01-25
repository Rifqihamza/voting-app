import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const resetSchema = z.object({
    id: z.number().int().positive(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const parsed = resetSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Data tidak valid", details: parsed.error.issues }, { status: 400 })
        }

        const { id } = parsed.data

        // Reset election to unpublished and delete all related votes
        await prisma.vote.deleteMany({ where: { electionId: id } })

        const updated = await prisma.election.update({
            where: { id },
            data: { isPublished: false },
        })

        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error("Error resetting election:", error)
        return NextResponse.json({ success: false, message: "Failed to reset election" }, { status: 500 })
    }
}
