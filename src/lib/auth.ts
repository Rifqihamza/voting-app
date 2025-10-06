import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"
import { headers } from "next/headers"

// Catatan: Jika Anda menggunakan Next.js App Router, file ini biasanya berada di
// src/app/api/auth/[...nextauth]/route.ts dan meng-export handler GET/POST
// yang menggunakan authOptions ini.

// Perluas tipe NextAuth agar menyertakan field 'role' dan 'nis'
declare module "next-auth" {
    interface Session {
        user: {
            id: number
            nis: string
            name: string
            role: string
        }
    }
    interface User {
        id: number
        nis: string
        name: string
        role: string
    }
    interface JWT {
        id: number
        nis: string
        name: string
        role: string
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                nis: { label: "NIS", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // 1. Validasi kredensial dasar
                if (!credentials?.nis || !credentials.password) {
                    return null
                }

                const nis = credentials.nis.trim()
                const password = credentials.password

                // Ambil info koneksi untuk LoginHistory
                const ipAddress = headers().get("x-forwarded-for") ?? req?.headers?.host ?? null
                const userAgent = headers().get("user-agent") ?? null

                let user = null;

                try {
                    // 2. Cari pengguna berdasarkan NIS
                    user = await prisma.user.findUnique({
                        where: { nis },
                    })

                    // Cek NIS ditemukan dan status aktif
                    if (!user || !user.isActive) {
                        const reason = user ? "User is inactive" : "NIS not found"

                        // Log gagal: NIS tidak ditemukan/tidak aktif
                        await prisma.loginHistory.create({
                            data: {
                                userId: user?.id || 0, // Gunakan ID user jika ditemukan, atau 0
                                ipAddress,
                                userAgent,
                                success: false,
                                reason: reason,
                            },
                        })
                        return null
                    }

                    // 3. Verifikasi password
                    const isPasswordValid = await verifyPassword(
                        password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        // Log gagal: Password salah
                        await prisma.loginHistory.create({
                            data: {
                                userId: user.id,
                                ipAddress,
                                userAgent,
                                success: false,
                                reason: "Invalid password",
                            },
                        })
                        return null
                    }

                    // 4. Login Berhasil: Log history
                    await prisma.loginHistory.create({
                        data: {
                            userId: user.id,
                            ipAddress,
                            userAgent,
                            success: true,
                            reason: "Login successful",
                        },
                    })

                    // Kembalikan objek user (akan disimpan di JWT dan Session)
                    return {
                        id: user.id,
                        nis: user.nis,
                        name: user.name,
                        role: user.role,
                    }

                } catch (error) {
                    console.error("Authorization error:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 hari
    },
    callbacks: {
        // Callback untuk memperbarui JWT dengan data user (id, nis, role)
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.nis = user.nis
                token.name = user.name
                token.role = user.role
            }
            return token
        },
        // Callback untuk menambahkan data JWT ke Session object
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as number
                session.user.nis = token.nis as string
                session.user.name = token.name as string
                session.user.role = token.role as string
            }
            return session
        },
    },
}
