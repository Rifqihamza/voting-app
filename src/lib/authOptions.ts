import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { verifyPassword } from "./password"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                nis: { label: "NIS", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.nis || !credentials?.password) {
                    throw new Error("NIS dan password wajib diisi.")
                }

                const user = await prisma.user.findUnique({
                    where: { nis: credentials.nis },
                })

                if (!user) throw new Error("User tidak ditemukan.")
                const isValid = await verifyPassword(credentials.password, user.password)
                if (!isValid) throw new Error("Password salah.")

                return {
                    id: user.id,
                    nis: user.nis,
                    name: user.name,
                    role: user.role,
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
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as number
                token.nis = user.nis
                token.name = user.name
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as number
                session.user.nis = token.nis as string
                session.user.name = token.name as string
                session.user.role = token.role as string
            }
            return session
        },
    }
}
