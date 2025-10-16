import "next-auth"
import "next-auth/jwt"


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
}


declare module "next-auth/jwt" {
    interface JWT {
        id: number
        nis: string
        name: string
        role: string
    }
}