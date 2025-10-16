"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, useRequireAdmin } from "@/hooks/useSession"
import { ShieldCheck, User, Crown } from "lucide-react"

/**
 * Example 1: Basic Protected Page
 */
export function BasicProtectedPage() {
    const { user, authenticated, isLoading } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !authenticated) {
            router.push("/login")
        }
    }, [authenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!authenticated) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <User className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome, {user?.name}!
                            </h1>
                            <p className="text-gray-600">NIS: {user?.nis}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">User ID</p>
                            <p className="text-lg font-semibold text-gray-900">{user?.id}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Role</p>
                            <p className="text-lg font-semibold text-purple-600">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Example 2: Admin Only Page
 */
export function AdminOnlyPage() {
    const { hasAccess, isLoading, user } = useRequireAdmin()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !hasAccess) {
            router.push("/unauthorized")
        }
    }, [hasAccess, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-purple-600"></div>
                    <p className="mt-4 text-gray-600">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!hasAccess) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <Crown className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600">Welcome, {user?.name}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Admin Access Granted
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    You have full access to admin features and settings.
                                    Use this power responsibly!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Admin content here */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                            <h4 className="font-semibold text-gray-900 mb-2">Manage Users</h4>
                            <p className="text-sm text-gray-600">View and edit user accounts</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                            <h4 className="font-semibold text-gray-900 mb-2">Elections</h4>
                            <p className="text-sm text-gray-600">Create and manage elections</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                            <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                            <p className="text-sm text-gray-600">View voting statistics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}