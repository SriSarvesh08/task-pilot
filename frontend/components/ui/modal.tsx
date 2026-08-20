import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "./button"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div 
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 rounded-xl border border-border bg-background p-6 shadow-lg sm:rounded-xl",
          className
        )}
        role="dialog"
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 hover:opacity-100" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
