import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '光影故事客厅 - 分享有故事的摄影作品',
  description: '一个温暖的线上摄影故事分享社区，通过视觉和文字连接情感，分享感动。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}