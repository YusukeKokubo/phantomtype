import { useEffect, useRef, type ReactNode } from "react"

interface ModalDialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function ModalDialog({
  open,
  title,
  onClose,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (open) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    const dialog = dialogRef.current
    if (dialog) {
      dialog.style.opacity = "0"
      dialog.style.transform = "scale(0.95)"
      setTimeout(() => {
        onClose()
        setTimeout(() => {
          dialog.style.opacity = ""
          dialog.style.transform = ""
        }, 50)
      }, 200)
    } else {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg shadow-lg bg-background border border-border p-2 w-[95%] md:w-2/3 m-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-light text-foreground">{title}</h2>
          <form method="dialog">
            <button
              type="submit"
              onClick={handleClose}
              className="text-text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="閉じる"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className="flex-1 overflow-y-auto h-max">{children}</div>
      </div>
    </dialog>
  )
}
