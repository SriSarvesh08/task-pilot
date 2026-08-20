import * as React from "react"
import { Project, CreateProjectInput, UpdateProjectInput } from "@/lib/api/projects"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>
  initialData?: Project | null
  isSubmitting?: boolean
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: ProjectModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialData?.name || "")
      setDescription(initialData?.description || "")
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Project" : "Create Project"}
      description={initialData ? "Update your project details below." : "Add a new project to organize your tasks."}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Marketing Campaign"
            required
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim() || isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
