import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { WhatsAppCSButton } from "@/components/WhatsAppCSButton";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "O-Pay",
  description: "E-commerce + Dompet Digital (demo)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* @ts-expect-error Async Server Component */}
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <WhatsAppCSButton />
      </body>
    </html>
  );
}
