import './globals.css'
import { ReactNode } from 'react'
import IndigitallProvider from '@/components/IndigitallProvider'

export const metadata = {
  title: 'My App',
  description: 'Indigitall SDK with App Router',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <IndigitallProvider />
        {children}
      </body>
    </html>
  )
}
