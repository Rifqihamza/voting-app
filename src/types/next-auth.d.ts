import { DefaultSession } from "next-auth"
declare module 'next-auth' {
    interface Session {
        user: {
            id: number
            name?: string
            nis: string
            role: string
        } & DefaultSession['STUDENT']
    }

    interface User {
        id: string
        name: string
        nis: string
        role: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string | number
        nis: string
        role: string
    }
}