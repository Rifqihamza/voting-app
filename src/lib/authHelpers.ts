import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Get current user session (Server Component)
 * Throws error if not authenticated
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    return session.user
}

/**
 * Check if user has required role
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await getCurrentUser()

    if (!allowedRoles.includes(user.role)) {
        redirect("/unauthorized")
    }

    return user
}

/**
 * Require Admin role
 */
export async function requireAdmin() {
    return await requireRole(["ADMIN"])
}

/**
 * Check if user is authenticated (optional - doesn't redirect)
 */
export async function getOptionalUser() {
    const session = await getServerSession(authOptions)
    return session?.user || null
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
    const roleHierarchy: Record<string, number> = {
        USER: 1,
        ADMIN: 2,
        SUPERADMIN: 3,
    }

    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)
}

/**
 * Format role name untuk display
 */
export function formatRole(role: string): string {
    const roleNames: Record<string, string> = {
        USER: "STUDENT",
        ADMIN: "ADMIN",
        SUPERADMIN: "SUPERADMIN",
    }

    return roleNames[role] || role
}