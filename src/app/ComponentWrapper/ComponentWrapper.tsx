"use client"

import { usePathname } from "next/navigation"
import NavbarComponent from "@/components/Navbar/NavbarComponent"
import FooterComponent from "@/components/Footer/FooterComponent"

export function NavbarWrapper() {
    const pathname = usePathname()

    // Jangan tampilkan navbar kalau di dashboard
    if (pathname.startsWith("/dashboard")) {
        return null
    }

    return <NavbarComponent />
}

export function FooterWrapper() {
    const pathname = usePathname()

    if (pathname.startsWith("/dashboard")) {
        return null
    }
    return <FooterComponent />
}
