"use client"

import * as React from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { ErrorState } from "@/components/ui/error-state"
import { FolderKanban, Plus } from "lucide-react"
import { projectsApi, Project, CreateProjectInput, UpdateProjectInput } from "@/lib/api/projects"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { ProjectModal } from "@/components/projects/ProjectModal"
import { ConfirmDeleteModal } from "@/components/tasks/ConfirmDeleteModal"

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [projectToEdit, setProjectToEdit] = React.useState<Project | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null)
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const loadProjects = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await projectsApi.getProjects()
      setProjects(res)
    } catch {
      setError("Failed to load projects. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects()
  }, [loadProjects])

  const handleOpenCreateModal = () => {
    setProjectToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (project: Project) => {
    setProjectToDelete(project)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: CreateProjectInput | UpdateProjectInput) => {
    try {
      setIsSubmitting(true)
      if (projectToEdit) {
        await projectsApi.updateProject(projectToEdit.id, data as UpdateProjectInput)
      } else {
        await projectsApi.createProject(data as CreateProjectInput)
      }
      setIsModalOpen(false)
      await loadProjects() // Refresh list
    } catch {
      alert("Failed to save project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return
    
    try {
      setIsSubmitting(true)
      await projectsApi.deleteProject(projectToDelete.id)
      setIsDeleteModalOpen(false)
      await loadProjects() // Refresh list
    } catch {
      alert("Failed to delete project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-[80vh]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks into projects.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading size="lg" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadProjects} />
      ) : projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
          <EmptyState 
            icon={FolderKanban}
            title="No projects found" 
            description="Create your first project to start organizing tasks."
            actionLabel="Create Project"
            onAction={handleOpenCreateModal}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={projectToEdit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={projectToDelete?.name || ""}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
