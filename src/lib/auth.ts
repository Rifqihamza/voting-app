// src/lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "NIS",
            credentials: {
                nis: { label: "NIS", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { nis, password } = credentials;
                const user = await prisma.user.findUnique({ where: { nis } });
                if (!user) return null;
                // NOTE: store hashed password in user.passwordHash
                const ok = await bcrypt.compare(password, user.passwordHash || user.password);
                if (!ok) return null;
                return { id: String(user.id), name: user.name, role: user.role };
            }
        })
    ],
    session: { strategy: "jwt", maxAge: 60 * 60 }, // 1 hour
    callbacks: {
        jwt: async ({ token, user }) => (user ? { ...token, ...user } : token),
        session: async ({ session, token }) => ({ ...session, user: token as any })
    },
    cookies: {
        sessionToken: {
            name: "__Host-next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/"
            }
        }
    }
};

export default NextAuth(authOptions);
