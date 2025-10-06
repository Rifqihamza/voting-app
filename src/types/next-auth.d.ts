// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            nis: string
            role: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: number
        nis: string
        role: string
    }

    interface JWT {
        id: number
        nis: string
        role: string
    }
}
