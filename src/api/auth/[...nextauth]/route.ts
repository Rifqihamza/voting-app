import NextAuth from 'next-auth/next' // ✅ default import
import { authOptions } from '@/lib/authOptions'

export const { GET, POST } = NextAuth(authOptions)