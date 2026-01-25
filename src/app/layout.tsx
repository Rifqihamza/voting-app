import type { Metadata } from "next"
import "../assets/css/globals.css"
import { SessionProvider } from "next-auth/react"
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
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
