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
        </section>
    )
}
