"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Settings, 
  X
} from "lucide-react"

export interface SidebarProps {
  className?: string
  isMobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
}

const navItems = [
  { name: "Workspace", href: "/workspace", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ className, isMobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span>TaskPilot</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0", className)}>
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen?.(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl transition-transform transform translate-x-0">
            <button
              onClick={() => setMobileOpen?.(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5 text-foreground" />
              <span className="sr-only">Close sidebar</span>
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
