export default function TutorialPage() {
    return (
        <>
            {/* ===== TIMELINE SECTION ===== */}
            <div className="mt-16 w-full flex flex-col items-center min-h-[100dvh]">
                <h2 className="text-2xl md:text-3xl text-center font-semibold mb-10 text-violet-600">
                    Cara Saya Voting?
                </h2>

                <ul className="timeline timeline-vertical w-full max-w-7xl">
                    <li>
                        <div className="timeline-start timeline-box text-lg bg-violet-100 text-violet-700 border-violet-300">
                            Buka halaman utama website e-voting.
                        </div>
                        <div className="timeline-middle">
                            <span className="timeline-icon rounded-full w-8 h-8 flex items-center justify-center bg-violet-500 text-white">
                                1
                            </span>
                        </div>
                        <hr className="bg-violet-300" />
                    </li>

                    <li>
                        <hr className="bg-violet-300" />
                        <div className="timeline-end timeline-box text-lg bg-violet-100 text-violet-700 border-violet-300">
                            Jika belum punya akun, klik tombol <b>Registrasi</b> dan isi data diri.
                        </div>
                        <div className="timeline-middle">
                            <span className="timeline-icon rounded-full w-8 h-8 flex items-center justify-center bg-violet-500 text-white">
                                2
                            </span>
                        </div>
                        <hr className="bg-violet-300" />
                    </li>

                    <li>
                        <hr className="bg-violet-300" />
                        <div className="timeline-start timeline-box text-lg bg-violet-100 text-violet-700 border-violet-300">
                            Jika sudah punya akun, klik tombol <b>Login</b> dan masukkan NIS serta password.
                        </div>
                        <div className="timeline-middle">
                            <span className="timeline-icon rounded-full w-8 h-8 flex items-center justify-center bg-violet-500 text-white">
                                3
                            </span>
                        </div>
                        <hr className="bg-violet-300" />
                    </li>

                    <li>
                        <hr className="bg-violet-300" />
                        <div className="timeline-end timeline-box text-lg bg-violet-100 text-violet-700 border-violet-300">
                            Setelah login, pilih kandidat yang ingin anda pilih dan klik <b>Vote</b>.
                        </div>
                        <div className="timeline-middle">
                            <span className="timeline-icon rounded-full w-8 h-8 flex items-center justify-center bg-violet-500 text-white">
                                4
                            </span>
                        </div>
                        <hr className="bg-violet-300" />
                    </li>

                    <li>
                        <hr className="bg-violet-300" />
                        <div className="timeline-start timeline-box text-lg bg-violet-100 text-violet-700 border-violet-300">
                            Vote anda tersimpan dan anda akan melihat pesan <b>“Terima kasih telah memilih!”</b>.
                        </div>
                        <div className="timeline-middle">
                            <span className="timeline-icon rounded-full w-8 h-8 flex items-center justify-center bg-violet-500 text-white">
                                5
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}