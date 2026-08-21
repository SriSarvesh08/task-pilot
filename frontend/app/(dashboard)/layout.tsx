"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { CheckSquare, Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const { isLoading, user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Wait for auth to initialize before rendering the protected shell
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckSquare className="h-6 w-6 text-primary" />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-1 flex-col md:pl-64">
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
