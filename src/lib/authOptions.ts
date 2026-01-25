import { prisma } from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { AdapterUser } from 'next-auth/adapters'
import type { NextAuthConfig } from 'next-auth'

const credentialSchema = z.object({
    nis: z.string().min(4, { message: 'NIS harus diisi' }),
    password: z.string().min(4, { message: 'Password harus diisi' }),
})

export const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                nis: { label: 'NIS', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = credentialSchema.safeParse(credentials)
                if (!parsed.success) return null

                const { nis, password } = parsed.data
                const user = await prisma.user.findUnique({ where: { nis } })
                if (!user || !user.isActive) return null

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null

                return {
                    id: user.id.toString(),
                    name: user.name,
                    nis: user.nis,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: '/AuthPage/login',
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
            if (user) {
                token.id = Number(user.id) || user.id
                token.role = user.role
                token.nis = user.nis
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token) {
                session.user.id = Number(token.id)
                session.user.role = token.role as string
                session.user.nis = token.nis as string
            }
            return session
        },
        async signIn() {
            return true
        }
    },
    session: {
        strategy: 'jwt',
    },
}
