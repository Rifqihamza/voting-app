import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { compare } from "bcryptjs"

// 1. Buat augmentasi tipe session
declare module "next-auth" {
    interface Session {
        user: {
            id: number
            nis: string
            role: string
        } & DefaultSession["user"]
    }
    interface JWT {
        id: number
        nis: string
        role: string
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                nis: { label: "NIS", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null

                // Type assertion agar TypeScript tahu keduanya string
                const nis = credentials.nis as string
                const password = credentials.password as string

                if (!nis || !password) return null

                const user = await prisma.user.findUnique({ where: { nis } })
                if (!user) return null

                const valid = await compare(password, user.password) // sekarang aman
                if (!valid) return null

                const alreadyVoted = await prisma.vote.findFirst({ where: { userId: user.id } })
                if (alreadyVoted) return null

                return {
                    id: user.id,
                    nis: user.nis,
                    role: user.role,
                    name: user.name,
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.nis = user.nis
                token.role = user.role
            }
            return token
        },
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as number,
                    nis: token.nis as string,
                    role: token.role as string,
                },
            }
        },
    },
})
