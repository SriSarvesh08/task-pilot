import * as React from "react"
import Link from "next/link"
import { Task } from "@/lib/api/tasks"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriorityBadge } from "./PriorityBadge"
import { StatusBadge } from "./StatusBadge"
import { Edit2, Trash2, Calendar } from "lucide-react"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <Card className="flex flex-col group hover:shadow-sm hover:border-primary/20 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              {task.title}
            </CardTitle>
          </Link>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onEdit(task)}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(task)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <Link href={`/tasks/${task.id}`} className="flex-1">
        <CardContent className="pb-3">
          {task.description ? (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {task.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-4">
              No description
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-auto">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </CardContent>
      </Link>
      {formattedDate && (
        <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 opacity-70" />
          <span>Due {formattedDate}</span>
        </CardFooter>
      )}
    </Card>
  )
}

