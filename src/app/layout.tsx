import type { Metadata } from "next"
import "../assets/css/globals.css"
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent"
import FooterComponent from "@/components/FooterComponent/FooterComponent"

export const metadata: Metadata = {
  title: "Voting App",
  description: "Website voting ketua OSIS",
  icons: "/Image/itlogo.png",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavbarComponent />
        {children}
        <FooterComponent />
      </body>
    </html>
  )
}
