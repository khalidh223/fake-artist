import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import type { Metadata } from "next"
import ThemeRegistry from "./ThemeRegistry"
import { DrawSocketProvider } from "@/app/DrawSocketProvider"
import { UserProvider } from "./UserProvider"

export const metadata: Metadata = {
  title: "Fake Artist Online",
  description: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DrawSocketProvider>
          <UserProvider>
            <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
          </UserProvider>
        </DrawSocketProvider>
      </body>
    </html>
  )
}
