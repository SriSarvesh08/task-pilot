"use client"

import * as React from "react"
import { Menu, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher"

export interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  
  // Create a simple fallback from user ID (e.g. "G" for guest)
  const fallback = user?.type === "guest" ? "G" : "U"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar fallback={fallback} />
        <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  )
}
