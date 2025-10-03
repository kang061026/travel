import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '여행 플래너',
  description: '실시간 일정 공유'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-base-white text-ink-deep">
        {children}
      </body>
    </html>
  )
}
