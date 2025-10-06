import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const elections = await prisma.election.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(elections)
    } catch (error) {
        console.error("Error fetching elections:", error)
        return NextResponse.json({ error: "Failed to fetch elections" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { title, description, startAt, endAt } = await req.json()

        if (!title || !startAt || !endAt) {
            return NextResponse.json(
                { error: "Title, startAt, and endAt are required" },
                { status: 400 }
            )
        }

        const newElection = await prisma.election.create({
            data: {
                title,
                description,
                startAt: new Date(startAt),
                endAt: new Date(endAt),
            },
        })

        return NextResponse.json(newElection)
    } catch (error) {
        console.error("Error creating election:", error)
        return NextResponse.json({ error: "Failed to create election" }, { status: 500 })
    }
}
