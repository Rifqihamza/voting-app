import LogoutButton from "@/components/LogoutComponent/LogoutButton";
import Link from "next/link";
import { BiArchive, BiChart, BiHome, BiUser } from "react-icons/bi";
import Image from "next/image";
import { GrGroup } from "react-icons/gr";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex">
            {/* Sidebar */}
            <aside className="w-64 h-screen px-4 py-4 bg-white fixed top-0 left-0 z-50">
                <ul className="space-y-5">
                    <li className="flex flex-row items-center gap-2 mb-10">
                        <div className="flex flex-row items-center gap-3">
                            <Image src="/Image/itlogo.png" alt="Logo IT" width={35} height={35} />
                            <Link href="/DashboardPage" className="tracking-wider hover:text-violet-500 duration-300 flex flex-col">
                                <h1 className="text-xl font-bold">KPRS</h1>
                                <span className="text-sm -mt-2 tracking-[6px] font-bold">2026</span>
                            </Link>
                        </div>
                    </li>
                    <li className="hover:text-violet-600 hover:bg-gray-100 px-3 py-2 rounded-lg duration-300">
                        <Link href="/DashboardPage/HomePage" className="text-xl font-semibold tracking-wider flex items-center gap-1">
                            <BiHome />
                            Home
                        </Link>
                    </li>
                    <li className="hover:text-violet-600 hover:bg-gray-100 px-3 py-2 rounded-lg duration-300">
                        <Link href="/DashboardPage/UserPage" className="text-xl font-semibold tracking-wider flex items-center gap-1">
                            <GrGroup />
                            Participants
                        </Link>
                    </li>
                    <li className="hover:text-violet-600 hover:bg-gray-100 px-3 py-2 rounded-lg duration-300">
                        <Link href="/DashboardPage/ElectionPage" className="text-xl font-semibold tracking-wider flex items-center gap-1">
                            <BiArchive />
                            Election
                        </Link>
                    </li>
                    <li className="hover:text-violet-600 hover:bg-gray-100 px-3 py-2 rounded-lg duration-300">
                        <Link href="/DashboardPage/CandidatePage" className="text-xl font-semibold tracking-wider flex items-center gap-1">
                            <BiUser />
                            Candidates
                        </Link>
                    </li>
                    <li className="hover:text-violet-600 hover:bg-gray-100 px-3 py-2 rounded-lg duration-300">
                        <Link href="/DashboardPage/AnalyticsPage" className="text-xl font-semibold tracking-wider flex items-center gap-1">
                            <BiChart />
                            Analytics
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Content Area */}
            <section className="flex-1 ml-60 min-h-screen bg-gray-100">
                {/* Top Navbar */}
                <nav className="flex items-end justify-end px-6 py-4 bg-white sticky top-0 left-0 z-50">
                    <LogoutButton />
                </nav>

                {/* Page Content */}
                <div className="p-6">{children}</div>
            </section>
        </main>
    );
}
