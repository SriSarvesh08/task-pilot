import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Button } from "./button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ 
  className, 
  title = "Something went wrong", 
  message = "There was an error loading the data. Please try again.", 
  onRetry,
  ...props 
}: ErrorStateProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 rounded-xl border border-destructive/20 bg-destructive/5", className)} 
      {...props}
    >
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-destructive">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}
