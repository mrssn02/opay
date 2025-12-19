import './globals.css'
import WhatsAppCSButton from '@/components/WhatsAppCSButton'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <WhatsAppCSButton />
      </body>
    </html>
  )
}
