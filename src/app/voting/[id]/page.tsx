// app/voting/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import CandidateDetailClient from "./CandidateDetailClient"

interface CandidateProps {
    params: { id: string }
}

export default async function CandidateDetail({ params }: CandidateProps) {
    const candidate = await prisma.candidate.findUnique({
        where: { id: Number(params.id) },
        include: { election: true }, // perlu electionId untuk vote
    })

    if (!candidate) {
        return <p>Candidate Not Found</p>
    }

    return <CandidateDetailClient candidate={candidate} />
}
