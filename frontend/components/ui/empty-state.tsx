import * as React from "react"
import { cn } from "@/lib/utils"
import { FileQuestion } from "lucide-react"
import { Button } from "./button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ElementType
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ 
  className, 
  title, 
  description, 
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50", className)} 
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
