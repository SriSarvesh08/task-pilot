import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? (
        <Image className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" width={40} height={40} />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
          {fallback}
        </div>
      )}
    </div>
  )
)
Avatar.displayName = "Avatar"

export { Avatar }
