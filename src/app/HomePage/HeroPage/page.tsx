import Link from "next/link"
import Image from "next/image"

export default function HeroPage() {
    return (
        <section id="home" className="flex flex-col items-center justify-center mx-auto w-full max-w-6xl min-h-[90dvh] md:min-h-dvh">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 relative w-full h-full">
                <div className="space-y-3 text-center md:text-start">
                    <h1 className="text-lg md:text-3xl font-bold uppercase tracking-wide md:block hidden">
                        Komisi Pemilihan <br /> Raya Sekolah
                    </h1>
                    <h1 className="text-lg md:text-3xl font-bold uppercase tracking-wide md:hidden block">
                        Komisi Pemilihan Raya Sekolah
                    </h1>
                    <p className="mb-4 text-sm md:text-lg w-96 md:text-justify text-center px-4 md:px-0">
                        Selamat datang di platform e-voting. Platform yang menyediakan pemilihan ketua OSIS yang tidak hanya aman dan transparan,
                        tetapi juga mudah diakses oleh seluruh siswa. Berikan suaramu untuk masa depan sekolah yang lebih baik.
                    </p>
                    <div className="flex flex-row items-end md:justify-start justify-center gap-3 w-full mt-4 mb-2">
                        <Link href="/AuthPage/login" className="bg-violet-500 text-white shadow shadow-gray-400 hover:shadow-gray-600 duration-300 text-center px-6 py-2 rounded-xl">Vote Now</Link>
                        <Link href="/AuthPage/register" className="bg-violet-500 text-white shadow shadow-gray-400 hover:shadow-gray-600 duration-300 text-center px-6 py-2 rounded-xl">Register First</Link>
                    </div>
                </div>
                <div className="w-1/2 h-1/2 md:w-full md:h-full flex items-center justify-center md:items-end md:justify-end translate-x-16">
                    <Image src="/Image/hero.png" alt="Vote Picture" className="object-cover" width={500} height={500} />
                </div>
            </div>
        </section>
    )
}