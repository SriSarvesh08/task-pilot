import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
}

export function Loading({ className, size = "default", ...props }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)} {...props}>
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "default",
            "h-8 w-8": size === "lg",
          }
        )} 
      />
    </div>
  )
}
