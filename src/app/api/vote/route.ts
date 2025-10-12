// app/api/vote/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { limitKey, rateLimitCheck } from "@/middleware/rateLimit";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // rate limit per user+ip
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
    try {
        await rateLimitCheck(`${ip}:${session.user.id}`);
    } catch (e) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const electionId = Number(body.electionId);
    const candidateId = Number(body.candidateId);
    if (!Number.isInteger(electionId) || !Number.isInteger(candidateId)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const election = await tx.election.findUnique({ where: { id: electionId } });
            if (!election || !election.isActive) throw new Error("Election is not active");

            const vote = await tx.vote.create({
                data: {
                    userId: Number(session.user.id),
                    electionId,
                    candidateId
                }
            });

            await tx.voteAudit.create({
                data: {
                    voteId: vote.id,
                    userId: Number(session.user.id),
                    electionId,
                    candidateId,
                    ip,
                    userAgent: req.headers.get("user-agent") || undefined
                }
            });

            return vote;
        });

        return NextResponse.json({ ok: true, vote: result });
    } catch (err: any) {
        if (err?.code === "P2002") {
            return NextResponse.json({ error: "You have already voted in this election" }, { status: 409 });
        }
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}
