'use client'

import useSWR from 'swr'

const fetcher = (url: string) =>
  fetch(url).then(res => res.json())

export default function WhatsAppCSButton() {
  const { data } = useSWR('/api/settings/whatsapp', fetcher)

  if (!data?.value) return null

  return (
    <a
      href={`https://wa.me/${data.value}`}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg"
    >
      CS WhatsApp
    </a>
  )
}
