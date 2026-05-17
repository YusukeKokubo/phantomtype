import { useState, useEffect } from "hono/jsx"
import { ModalDialog } from "./ModalDialog"
import { MarkdownViewer } from "./MarkdownViewer"

interface ModalState {
  title: string
  content: string
  isOpen: boolean
}

const initialModalState: ModalState = {
  title: "",
  content: "",
  isOpen: false,
}

export function YusukeModal() {
  const [modalState, setModalState] = useState<ModalState>(initialModalState)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest("[data-entry-id]")
      if (button) {
        const title = button.getAttribute("data-entry-title")
        const detail = button.getAttribute("data-entry-detail")
        if (title && detail) {
          setModalState({
            title,
            content: detail,
            isOpen: true,
          })
        }
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    const dialogEl = document.getElementById(
      "yusuke-modal-dialog"
    ) as HTMLDialogElement | null
    if (dialogEl) {
      if (modalState.isOpen) {
        dialogEl.showModal()
      } else {
        dialogEl.close()
      }
    }
  }, [modalState.isOpen])

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <ModalDialog title={modalState.title} onClose={handleClose}>
      <MarkdownViewer markdown={modalState.content} />
    </ModalDialog>
  )
}
