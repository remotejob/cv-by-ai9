import type { Metadata } from 'next'
import '../globals.css'
import { Navigation } from '@/components/navigation'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'DevOps Portfolio',
  description: 'Modern DevOps Portfolio Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="p-8 text-center text-gray-5">
            <p className="text-body">© 2024 DevOps Portfolio. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}