import type { Metadata } from "next"
import Providers from "./Providers"
import "./globals.css"
import { NavbarWrapper, FooterWrapper } from "./ComponentWrapper/ComponentWrapper"

export const metadata: Metadata = {
  title: "Voting App",
  description: "Website voting ketua OSIS",
  icons: "/itlogo.png",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavbarWrapper />
          {children}
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  )
}
