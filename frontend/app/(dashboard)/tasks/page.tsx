"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { ErrorState } from "@/components/ui/error-state"
import { CheckSquare, Plus, Search } from "lucide-react"
import { tasksApi, Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from "@/lib/api/tasks"
import { TaskCard } from "@/components/tasks/TaskCard"
import { TaskModal } from "@/components/tasks/TaskModal"
import { ConfirmDeleteModal } from "@/components/tasks/ConfirmDeleteModal"
import { FilterBar, FilterState } from "@/components/tasks/FilterBar"

export default function TasksPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<FilterState>({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as 'ASC' | 'DESC') || "DESC",
  })

  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [taskToEdit, setTaskToEdit] = React.useState<Task | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null)
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const loadTasks = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await tasksApi.getTasks({
        search: filters.search || undefined,
        status: (filters.status as TaskStatus) || undefined,
        priority: (filters.priority as TaskPriority) || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })
      setTasks(res.data)
    } catch {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks()
  }, [loadTasks])

  const handleOpenCreateModal = () => {
    setTaskToEdit(null)
    setIsTaskModalOpen(true)
  }

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task)
    setIsTaskModalOpen(true)
  }

  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
  }

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    
    const params = new URLSearchParams()
    if (updated.search) params.set("search", updated.search)
    if (updated.status) params.set("status", updated.status)
    if (updated.priority) params.set("priority", updated.priority)
    if (updated.sortBy !== "createdAt") params.set("sortBy", updated.sortBy)
    if (updated.sortOrder !== "DESC") params.set("sortOrder", updated.sortOrder)
    
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleClearFilters = () => {
    handleFilterChange({
      search: "",
      status: "",
      priority: "",
      sortBy: "createdAt",
      sortOrder: "DESC"
    })
  }

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.status || 
    filters.priority || 
    filters.sortBy !== 'createdAt' || 
    filters.sortOrder !== 'DESC'
  )

  const handleTaskSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      setIsSubmitting(true)
      if (taskToEdit) {
        await tasksApi.updateTask(taskToEdit.id, data as UpdateTaskInput)
      } else {
        await tasksApi.createTask(data as CreateTaskInput)
      }
      setIsTaskModalOpen(false)
      await loadTasks() // Refresh list
    } catch {
      alert("Failed to save task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return
    
    try {
      setIsSubmitting(true)
      await tasksApi.deleteTask(taskToDelete.id)
      setIsDeleteModalOpen(false)
      await loadTasks() // Refresh list
    } catch {
      alert("Failed to delete task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-[80vh]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks and priorities.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <FilterBar 
        filters={filters} 
        onChange={handleFilterChange} 
        onClear={handleClearFilters} 
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading size="lg" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadTasks} />
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
          {hasActiveFilters ? (
            <EmptyState 
              icon={Search}
              title="No tasks match your filters." 
              description="Try adjusting your filters or search terms."
              actionLabel="Clear filters"
              onAction={handleClearFilters}
            />
          ) : (
            <EmptyState 
              icon={CheckSquare}
              title="No tasks found" 
              description="You don't have any tasks yet. Create a task to get started."
              actionLabel="Create Task"
              onAction={handleOpenCreateModal}
            />
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialData={taskToEdit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={taskToDelete?.title || ""}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
