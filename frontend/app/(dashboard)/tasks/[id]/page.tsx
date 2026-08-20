"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { tasksApi, Task, UpdateTaskInput, TaskStatus, TaskPriority } from "@/lib/api/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { StatusBadge } from "@/components/tasks/StatusBadge"
import { PriorityBadge } from "@/components/tasks/PriorityBadge"
import { TaskModal } from "@/components/tasks/TaskModal"
import { ConfirmDeleteModal } from "@/components/tasks/ConfirmDeleteModal"
import { Select } from "@/components/ui/select"
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  SearchX,
} from "lucide-react"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = React.useState<Task | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [notFound, setNotFound] = React.useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const loadTask = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      setNotFound(false)
      const data = await tasksApi.getTask(taskId)
      setTask(data)
    } catch (err) {
      const apiErr = err as { statusCode?: number }
      if (apiErr?.statusCode === 404) {
        setNotFound(true)
      } else {
        setError("Failed to load task. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [taskId])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTask()
  }, [loadTask])

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return
    try {
      const updated = await tasksApi.updateTask(task.id, { status: newStatus })
      setTask(updated)
    } catch {
      alert("Failed to update status")
    }
  }

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (!task) return
    try {
      const updated = await tasksApi.updateTask(task.id, { priority: newPriority })
      setTask(updated)
    } catch {
      alert("Failed to update priority")
    }
  }

  const handleDueDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task) return
    const newDate = e.target.value
    try {
      const updated = await tasksApi.updateTask(task.id, {
        dueDate: newDate ? new Date(newDate).toISOString() : undefined,
      })
      setTask(updated)
    } catch {
      alert("Failed to update due date")
    }
  }

  const handleEditSubmit = async (data: UpdateTaskInput) => {
    if (!task) return
    try {
      setIsSubmitting(true)
      const updated = await tasksApi.updateTask(task.id, data)
      setTask(updated)
      setIsEditModalOpen(false)
    } catch {
      alert("Failed to save task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!task) return
    try {
      setIsSubmitting(true)
      await tasksApi.deleteTask(task.id)
      router.push("/tasks")
    } catch {
      alert("Failed to delete task")
      setIsSubmitting(false)
    }
  }

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center justify-center flex-1">
          <Loading size="lg" />
        </div>
      </div>
    )
  }

  // --- Not Found State ---
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Task not found</h2>
        <p className="text-muted-foreground max-w-sm">
          The task you&apos;re looking for doesn&apos;t exist or is no longer available.
        </p>
        <Link href="/tasks">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>
    )
  }

  // --- Error State ---
  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-destructive">Something went wrong</h2>
        <p className="text-muted-foreground max-w-sm">{error}</p>
        <div className="flex gap-3">
          <Link href="/tasks">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
          <Button onClick={loadTask}>Try Again</Button>
        </div>
      </div>
    )
  }

  // --- Task Detail ---
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  const dueDateInputValue = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : ""

  const createdAt = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const updatedAt = new Date(task.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight break-words">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.description ? (
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </CardContent>
          </Card>

          {/* Priority Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </CardContent>
          </Card>

          {/* Due Date Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formattedDueDate && (
                <p className="text-sm font-medium mb-3">{formattedDueDate}</p>
              )}
              <input
                type="date"
                value={dueDateInputValue}
                onChange={handleDueDateChange}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
              {!task.dueDate && (
                <p className="text-xs text-muted-foreground mt-2">No due date set</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm">{updatedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={task}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={task.title}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
