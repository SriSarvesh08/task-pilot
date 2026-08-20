import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { TaskStatus } from "@/lib/api/tasks"

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    TODO: { label: "To Do", variant: "secondary" as const },
    IN_PROGRESS: { label: "In Progress", variant: "default" as const },
    COMPLETED: { label: "Completed", variant: "success" as const },
  }

  const { label, variant } = config[status] || config.TODO

  return <Badge variant={variant}>{label}</Badge>
}
