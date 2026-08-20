import * as React from "react"
import Link from "next/link"
import { Project } from "@/lib/api/projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, Edit2, Trash2 } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit(project)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(project)
  }

  return (
    <Card className="flex flex-col group hover:shadow-sm hover:border-primary/20 transition-all duration-200">
      <Link href={`/projects/${project.id}`} className="flex-1 flex flex-col min-w-0 h-full p-0">
        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base truncate" title={project.name}>
              {project.name}
            </CardTitle>
          </div>
          
          <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleEdit}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {project.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description</p>
          )}
          
          <div className="mt-4 flex items-center text-xs text-muted-foreground font-medium">
            <span className="px-2 py-1 rounded-full bg-secondary">
              {project.taskCount || 0} Task{(project.taskCount !== 1) ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
