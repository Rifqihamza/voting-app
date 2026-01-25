// app/VotingPage/[id]/page.tsx
import VoteCandidateClient from "@/components/VotingCandidateClient/VoteCandidateClient"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function VotingDetailPage({ params }: PageProps) {
    const { id } = await params
    const candidateId = Number(id)

    if (isNaN(candidateId)) {
        notFound()
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined")
    }

    let res: Response

    try {
        res = await fetch(`${apiUrl}/candidate/${candidateId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
            cache: "no-store",
        })
    } catch (error) {
        console.error("FETCH ERROR:", error)
        throw new Error("Failed to connect to backend API")
    }

    if (!res.ok) {
        notFound()
    }

    const candidate = await res.json()

    return <VoteCandidateClient candidate={candidate} />
}
