import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Comedor Industrial "El Buen Rugroso"',
  description: 'Aplicacion Web para la gestion de comedores industriales',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
