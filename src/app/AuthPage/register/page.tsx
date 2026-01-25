"use client"

import { useState } from "react"
import Link from "next/link"
import { useRegister } from "@/hook/useRegister"

export default function RegisterPage() {
    const [nis, setNis] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [kelas, setKelas] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)
    const { register } = useRegister()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            await register({ nis, name, password, kelas })
            setIsPending(false)
            setFormSuccess("Yess Register berhasil!, Silakan login")
            // redirect setelah delay biar toast sempet muncul
            setTimeout(() => {
                window.location.href = "/AuthPage/login"
            }, 1500)
        } catch (err: unknown) {
            console.log(err)
            setFormError("Duhh, ada kesalahan saat register")
            setIsPending(false)
        }

    }

    return (
        <>
            {/* Error Toast */}
            {formError && (
                <div className="toast toast-top toast-end absolute z-50">
                    <div className="alert alert-error">
                        <span>{formError}</span>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {formSuccess && (
                <div className="toast toast-top toast-end absolute z-50">
                    <div className="alert alert-success">
                        <span>{formSuccess}</span>
                    </div>
                </div>
            )}

            <div className="w-full max-w-sm min-h-[100dvh] flex items-center justify-center mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-2xl shadow-md shadow-gray-400 w-full h-full space-y-4 bg-white/5 backdrop-blur-xl"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-2xl font-bold">Register</h1>
                        <p>Fill the form to register</p>
                    </div>

                    <div className="flex flex-col justify-between gap-4 w-full">
                        <label htmlFor="nis">NIS</label>
                        <input
                            type="text"
                            placeholder="0123456789"
                            value={nis}
                            onChange={(e) => setNis(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                        <label htmlFor="username">Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Jhon Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                    </div>

                    <div className="flex flex-col justify-between gap-4 w-full">
                        <label htmlFor="class">Kelas</label>
                        <input
                            type="text"
                            placeholder="XII Elektronika Industri 1"
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full px-4 py-2 rounded-full bg-violet-500 text-white shadow shadow-gray-400 hover:shadow-gray-600 duration-300"
                    >
                        {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
                    </button>

                    <div className="flex items-center gap-1 justify-center">
                        <p className="text-sm">Sudah punya akun?</p>
                        <Link href={"/AuthPage/login"} className="text-violet-500 underline">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}
