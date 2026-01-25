import { notFound } from "next/navigation"
import VoteCandidateClient from "@/components/VotingCandidateClient/VoteCandidateClient"

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function VotingDetailPage({ params }: PageProps) {
    const { id } = await params
    const candidateId = Number(id)

    if (!candidateId) {
        notFound()
    }

    // 🔹 fetch API internal (SERVER SIDE)
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/${candidateId}`,
        { cache: "no-store" }
    )

    if (!res.ok) {
        notFound()
    }

    const candidate = await res.json()

    return <VoteCandidateClient candidate={candidate} />
}
