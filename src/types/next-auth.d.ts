declare module 'next-auth' {
    interface Session {
        user: {
            id: number
            name: string
            nis: string
            role: string
        }
    }

    interface User {
        id: number
        name: string
        nis: string
        role: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number
        nis: string
        role: string
    }
}