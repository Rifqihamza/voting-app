import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import * as z from 'zod'
import type { JWT } from 'next-auth/jwt'
import type { Session, User, NextAuthOptions } from 'next-auth' // ✅ perbaikan

const prisma = new PrismaClient()

const credentialSchema = z.object({
    nis: z.string().min(4, { message: 'NIS harus diisi' }),
    password: z.string().min(4, { message: 'Password harus diisi' }),
})

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                nis: { label: 'NIS', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = credentialSchema.safeParse(credentials)
                if (!parsed.success) {
                    console.error('Validasi gagal:', parsed.error.format())
                    return null
                }

                const { nis, password } = parsed.data

                const user = await prisma.user.findUnique({ where: { nis } })
                if (!user || !user.isActive) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name,
                    nis: user.nis,
                    role: user.role,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.nis = user.nis
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token) {
                session.user.id = token.id as number
                session.user.role = token.role as string
                session.user.nis = token.nis as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
}