import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
// Deploy trigger: Sun Oct 11 00:37:41 IST 2026
