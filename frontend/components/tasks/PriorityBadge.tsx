import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { TaskPriority } from "@/lib/api/tasks"

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = {
    LOW: { label: "Low", variant: "secondary" as const },
    MEDIUM: { label: "Medium", variant: "warning" as const },
    HIGH: { label: "High", variant: "destructive" as const },
  }

  const { label, variant } = config[priority] || config.MEDIUM

  return <Badge variant={variant}>{label}</Badge>
}
