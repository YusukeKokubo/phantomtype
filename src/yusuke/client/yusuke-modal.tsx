import { useState, useEffect } from "hono/jsx"
import { render } from "hono/jsx/dom"
import { ModalDialog } from "./components/ModalDialog"
import { MarkdownViewer } from "./components/MarkdownViewer"

interface ModalState {
  title: string
  content: string
  isOpen: boolean
}

function YusukeModal() {
  const [modalState, setModalState] = useState<ModalState>({
    title: "",
    content: "",
    isOpen: false,
  })

  useEffect(() => {
    // エントリボタンのクリックイベント
    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest("[data-entry-id]")
      if (button) {
        const title = button.getAttribute("data-entry-title")
        const detail = button.getAttribute("data-entry-detail")
        if (title && detail) {
          setModalState({
            title: title,
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

  // モーダルの開閉を制御
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

  // モーダルを閉じる
  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <ModalDialog title={modalState.title} onClose={handleClose}>
      <MarkdownViewer markdown={modalState.content} />
    </ModalDialog>
  )
}

// クライアントサイドでの初期化（ドキュメントの例に従う）
const modalContainer = document.getElementById("yusuke-modal-container")
if (modalContainer) {
  render(<YusukeModal />, modalContainer)
}
