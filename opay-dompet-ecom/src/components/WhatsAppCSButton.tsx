"use client";
import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function WhatsAppCSButton() {
  const { data } = useSWR("/api/settings/whatsapp", fetcher);
  const num: string = data?.number ?? "6280000000000";
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Halo CS O-Pay, saya butuh bantuan.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 rounded-full px-4 py-3 shadow-lg bg-green-600 text-white font-medium"
      aria-label="Customer Service WhatsApp"
    >
      CS WhatsApp
    </a>
  );
}
