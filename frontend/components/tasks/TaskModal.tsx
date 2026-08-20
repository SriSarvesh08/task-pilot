import * as React from "react"
import { Task, TaskStatus, TaskPriority, CreateTaskInput, UpdateTaskInput } from "@/lib/api/tasks"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { projectsApi, Project } from "@/lib/api/projects"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>
  initialData?: Task | null
  isSubmitting?: boolean
}

export function TaskModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TaskModalProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<TaskStatus>("TODO")
  const [priority, setPriority] = React.useState<TaskPriority>("MEDIUM")
  const [dueDate, setDueDate] = React.useState("")
  const [projectId, setProjectId] = React.useState<string>("")
  const [projects, setProjects] = React.useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingProjects(true)
      projectsApi.getProjects()
        .then(setProjects)
        .catch(console.error)
        .finally(() => setIsLoadingProjects(false))
    }
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialData?.title || "")
      setDescription(initialData?.description || "")
      setStatus(initialData?.status || "TODO")
      setPriority(initialData?.priority || "MEDIUM")
      setProjectId(initialData?.projectId || "")
      
      if (initialData?.dueDate) {
        // Format for datetime-local input (YYYY-MM-DD)
        const date = new Date(initialData.dueDate)
        const formattedDate = date.toISOString().split('T')[0]
        setDueDate(formattedDate)
      } else {
        setDueDate("")
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      title,
      description: description || undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId: projectId || undefined,
    }

    await onSubmit(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Task" : "Create Task"}
      description={initialData ? "Update the details of your task." : "Add a new task to your workspace."}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title *</label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title" 
            required 
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Task description (optional)" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select 
              id="status" 
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">Priority</label>
            <Select 
              id="priority" 
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
            <Input 
              id="dueDate" 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="projectId" className="text-sm font-medium">Project</label>
            <Select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={isLoadingProjects}
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {initialData ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
