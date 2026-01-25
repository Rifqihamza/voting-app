import { authOptions } from "@/lib/authOptions"
import NextAuth from "next-auth"

const { handlers } = NextAuth(authOptions)

export const { GET, POST } = handlers
