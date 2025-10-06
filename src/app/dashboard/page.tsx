import Link from "next/link";

export default function DashboardPage() {
    return (
        <section className="w-full p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Selamat Pagi, Admin!</h1>
                <p className="text-gray-600">
                    Selamat datang di dashboard, halaman untuk mengelola semua data
                    pemilihan
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                    href="/dashboard/home"
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Home</h2>
                    <p className="text-gray-500">Overview data pemilihan</p>
                </Link>
                <Link
                    href="/dashboard/participants"
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Participants</h2>
                    <p className="text-gray-500">Kelola data peserta pemilih</p>
                </Link>

                <Link
                    href="/dashboard/candidates"
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Candidates</h2>
                    <p className="text-gray-500">Kelola data kandidat pemilihan</p>
                </Link>

                <Link
                    href="/dashboard/analytics"
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                    <p className="text-gray-500">Lihat hasil voting dan statistik</p>
                </Link>
            </div>
        </section>
    );
}
