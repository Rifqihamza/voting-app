import Link from "next/link"
import Image from "next/image"

interface CandidateCardProps {
    id: number
    nameKetua: string
    nameWakil: string
    foto?: string | null
}

export default function CandidateCard({ id, nameKetua, nameWakil, foto }: CandidateCardProps) {
    return (
        <div className="p-4 shadow rounded-xl">
            <Image
                src={foto || "/placeholder.jpg"}
                alt={nameKetua}
                width={500}
                height={500}
                className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="mt-2 text-xl font-bold">{nameKetua} & {nameWakil}</h2>
            <Link
                href={`/candidates/${id}`}
                className="inline-block mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
                Lihat Detail
            </Link>
        </div>
    )
}
