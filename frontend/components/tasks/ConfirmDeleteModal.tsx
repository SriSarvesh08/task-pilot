import * as React from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title: string
  isSubmitting?: boolean
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, isSubmitting }: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
    >
      <div className="flex justify-end gap-3 pt-4 mt-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Delete Task
        </Button>
      </div>
    </Modal>
  )
}
