interface ModalDialogProps {
  title: string
  onClose: () => void
  children: any
}

export function ModalDialog({ title, onClose, children }: ModalDialogProps) {
  // モーダル外をクリックしたときの処理
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      id="yusuke-modal-dialog"
      class="backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg shadow-lg bg-background border border-border p-2 w-1/2 m-auto"
      onClick={handleBackdropClick}
    >
      <div class="flex flex-col h-full max-h-[90vh]">
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-2xl font-light text-foreground">{title}</h2>
          <form method="dialog">
            <button
              type="submit"
              onClick={onClose}
              class="text-text-secondary hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="閉じる"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </form>
        </div>
        <div class="flex-1 overflow-y-auto h-max">{children}</div>
      </div>
    </dialog>
  )
}
