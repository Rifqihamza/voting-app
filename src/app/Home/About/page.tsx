export default function AboutPage() {
    return (
        <section className="w-full max-w-7xl min-h-[100dvh] mx-auto flex flex-col items-center justify-center px-6 py-12">
            {/* ===== TITLE ===== */}
            <h1 className="text-3xl md:text-4xl uppercase font-semibold tracking-wider mb-10 text-center text-violet-500">
                About KPRS
            </h1>

            {/* ===== ABOUT SECTION ===== */}
            <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-center gap-10 md:gap-20">
                {/* Text Section */}
                <div className="text-sm md:text-base w-full md:w-1/2 space-y-4">
                    <h2 className="text-xl md:text-2xl font-medium mb-2 text-violet-600">
                        Apa itu KPRS dan E-Voting?
                    </h2>
                    <p className="text-base md:text-lg text-justify">
                        <b>KPRS</b> adalah sebuah event yang diadakan oleh SMK Mitra Industri MM2100
                        untuk pemilihan Ketua dan Wakil Ketua OSIS.
                    </p>
                    <p className="text-base md:text-lg text-justify">
                        <b>E-Voting</b> adalah platform yang menyediakan pemilihan ketua OSIS yang
                        tidak hanya aman dan transparan, tapi juga mudah diakses oleh seluruh siswa.
                    </p>
                </div>

                {/* Question Marks Decoration */}
                <div className="relative flex items-center justify-center w-full md:w-1/2 h-[200px] md:h-[300px]">
                    <h1 className="text-violet-500 text-[6rem] md:text-[10rem] font-bold absolute -translate-x-[4rem] md:-translate-x-[8rem] -rotate-12">
                        ?
                    </h1>
                    <h1 className="text-violet-500 text-[6rem] md:text-[10rem] font-bold absolute -translate-y-5 md:-translate-y-10">
                        ?
                    </h1>
                    <h1 className="text-violet-500 text-[6rem] md:text-[10rem] font-bold absolute translate-x-[4rem] md:translate-x-[8rem] rotate-12">
                        ?
                    </h1>
                </div>
            </div>

            {/* ===== TIMELINE SECTION ===== */}
            <div className="mt-16 w-full flex flex-col items-center">
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
        </section>
    )
}
