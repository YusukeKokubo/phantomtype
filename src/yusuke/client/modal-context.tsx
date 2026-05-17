import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Child,
} from "hono/jsx"
import { ModalDialog } from "./components/ModalDialog"
import { MarkdownViewer } from "./components/MarkdownViewer"

export interface YusukeModalContextValue {
  openEntry: (title: string, detail: string) => void
}

const YusukeModalContext = createContext<YusukeModalContextValue | null>(null)

export function useYusukeModal(): YusukeModalContextValue {
  const context = useContext(YusukeModalContext)
  if (!context) {
    throw new Error("useYusukeModal must be used within YusukeModalProvider")
  }
  return context
}

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

export function YusukeModalProvider({ children }: { children: Child }) {
  const [modalState, setModalState] = useState<ModalState>(initialModalState)

  const openEntry = (title: string, detail: string) => {
    setModalState({ title, content: detail, isOpen: true })
  }

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
    <YusukeModalContext.Provider value={{ openEntry }}>
      {children}
      <ModalDialog title={modalState.title} onClose={handleClose}>
        <MarkdownViewer markdown={modalState.content} />
      </ModalDialog>
    </YusukeModalContext.Provider>
  )
}
