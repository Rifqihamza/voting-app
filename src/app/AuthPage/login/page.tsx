"use client"

import { useState } from "react"
import { useLogin } from "@/hook/useLogin"
import Link from "next/link"

export default function LoginPage() {
    const [nis, setNis] = useState("")
    const [password, setPassword] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)
    const { login, isLoading, error } = useLogin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)
        setFormSuccess(null)

        const success = await login({ nis, password })

        if (!success) {
            setFormError(error || "Yahh Login gagal, Cek lagi NIS dan Passwordnya ya")
            setTimeout(() => {
                window.location.reload()
            }, 1500)
            return
        }

        setFormSuccess(`Yeayy, Login berhasil!, Selamat Datang`)

        // The useLogin hook handles the redirect based on role internally
        // No need to manually check role here since the hook already does this

    }


    return (
        <>
            {/* Form */}
            <div className="relative flex justify-center items-center min-h-dvh w-full max-w-sm mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-2xl shadow-md shadow-gray-400 w-full h-full space-y-4 bg-white/5 backdrop-blur-xl"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p>Login to your account</p>
                    </div>

                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder="NIS"
                            value={nis}
                            onChange={(e) => setNis(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 outline-none shadow-inner shadow-gray-300 rounded-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full px-4 py-2 rounded-full bg-violet-500 text-white shadow shadow-gray-400 hover:shadow-gray-600 duration-300"
                    >
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
                    </button>

                    <div className="flex items-center gap-1">
                        <p className="text-sm">Don`t Have Account ?</p >
                        <Link href={"/AuthPage/register"} className="text-violet-500 underline">
                            Sign Up
                        </Link>
                    </div >
                </form >
                {/* Error Toast */}
                {
                    formError && (
                        <div className="toast toast-top absolute z-50">
                            <div className="alert alert-error">
                                <span>{formError}</span>
                            </div>
                        </div>
                    )
                }

                {/* Success Toast */}
                {
                    formSuccess && (
                        <div className="toast toast-top absolute z-50">
                            <div className="alert alert-success">
                                <span>{formSuccess}</span>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    )
}
