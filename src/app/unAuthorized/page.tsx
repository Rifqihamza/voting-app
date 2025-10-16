import { ShieldX, Home, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header with Icon */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm mb-4">
                            <ShieldX className="text-white" size={48} strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Akses Ditolak
                        </h1>
                        <p className="text-red-100 text-lg">
                            Access Denied - 403 Forbidden
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Anda Tidak Memiliki Izin
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                                Halaman yang Anda coba akses hanya tersedia untuk pengguna dengan role tertentu.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
                            <h3 className="font-semibold text-orange-900 mb-2">
                                Kemungkinan Penyebab:
                            </h3>
                            <ul className="text-sm text-orange-700 space-y-2 text-left list-disc list-inside">
                                <li>Anda tidak memiliki role yang sesuai (Admin/User)</li>
                                <li>Link yang Anda akses salah atau sudah tidak aktif</li>
                                <li>Akun Anda belum diverifikasi</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/dashboardPage"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Home size={20} />
                                Kembali ke Dashboard
                            </a>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                <ArrowLeft size={20} />
                                Kembali
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-sm text-gray-500 mt-8">
                            Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Error Code: <span className="font-mono font-semibold">403</span>
                    </p>
                </div>
            </div>
        </div>
    )
}