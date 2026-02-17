import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel - NSS Club",
  description: "Admin panel for NSS Club management",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-muted/30">{children}</div>
}

