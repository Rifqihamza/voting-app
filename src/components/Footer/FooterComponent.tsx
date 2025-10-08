import Link from "next/link"
import { BsInstagram, BsFacebook, BsYoutube } from "react-icons/bs"
import { BiEnvelope, BiMap, BiPhoneCall } from "react-icons/bi"
import { useSession } from "next-auth/react"
export default function FooterComponent() {
    const { data: session } = useSession()

    const date = new Date().getFullYear()
    return (
        <footer className="w-full max-w-7xl h-full mx-auto px-4 py-10 border-t border-gray-200 relative">
            <div className="container">
                <div className="w-full flex flex-col md:flex-row justify-between gap-5">
                    {/* Title */}
                    <div className="w-full">
                        <h1 className="text-3xl font-bold tracking-widest text-violet-500">KPRS</h1>
                        <h2 className="font-semibold">Komisi Pemilihan Raya Sekolah</h2>
                        <p className="w-1/2 font-normal">Platform pemilihan Ketua & Wakil Ketua OSIS SMK Mitra Industri MM2100</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 w-full">
                        {/* Quick Menu */}
                        {!session && (
                            <div>
                                <h1 className="text-2xl font-bold tracking-widest text-violet-500">Menu</h1>
                                <ul className="">
                                    <li className="text-xl font-medium">
                                        <Link href="#home" className="relative group">
                                            Home
                                            <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-violet-500 duration-300"></span>
                                        </Link>
                                    </li>
                                    <li className="text-xl font-medium">
                                        <Link href="#about" className="relative group">
                                            About
                                            <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-violet-500 duration-300"></span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Social Media */}
                        <div className="w-full">
                            <h1 className="text-2xl font-bold tracking-widest text-violet-500">Social Media</h1>
                            <div className="flex flex-col gap-2 mt-3">
                                <Link href="https://www.instagram.com/mitra_industri/" target="_blank" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BsInstagram size={16} />
                                    @mitra_industri
                                </Link>
                                <Link href="https://www.instagram.com/osismitraindustri/" target="_blank" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BsInstagram size={16} />
                                    @osismitraindustri
                                </Link>
                                <Link href="https://www.facebook.com/SmkMitraIndustriMM2100" target="_blank" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BsFacebook size={16} />
                                    SMK Mitra Industri
                                </Link>

                                <Link href="https://www.facebook.com/SmkMitraIndustriMM2100" target="_blank" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BsYoutube size={16} />
                                    SMK Mitra Industri
                                </Link>
                            </div>
                        </div>
                        {/* Contact */}
                        <div className="w-full">
                            <h1 className="text-2xl font-bold tracking-widest text-violet-500">Contact</h1>
                            <div className="flex flex-col gap-2 mt-3">
                                <Link href="mailto:smkmitraindustrimm2100@smkind-mm2100.sch.id" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BiPhoneCall size={20} />
                                    (021) 8998-3961
                                </Link>
                                <Link href="mailto:smkmitraindustrimm2100@smkind-mm2100.sch.id" className="hover:text-violet-400 duration-300 flex flex-row items-center gap-2">
                                    <BiEnvelope size={20} />
                                    smkmitraindustrimm2100@smkind-mm2100.sch.id
                                </Link>
                                <Link href="https://maps.app.goo.gl/ZYEwf8gNMzJUFREXA" className="hover:text-violet-400 duration-300 flex flex-row gap-2">
                                    <BiMap size={38} />
                                    Kawasan Industri MM2100 Jl. Kalimantan Blok DD 1-1, Danau Indah, Kec. Cikarang Bar., Kabupaten Bekasi, Jawa Barat 17530
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="absolute bottom-0 left-0 w-full text-xs text-center">&copy; {date} CodersProject. All rights reserved.</h1>
        </footer>
    )
}