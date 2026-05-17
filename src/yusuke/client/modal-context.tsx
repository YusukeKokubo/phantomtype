import { createContext, useContext, useState, type ReactNode } from "react"
import { MarkdownViewer } from "./components/MarkdownViewer"
import { ModalDialog } from "./components/ModalDialog"

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
}

export function YusukeModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const openEntry = (title: string, detail: string) => {
    setModalState({ title, content: detail })
  }

  const handleClose = () => {
    setModalState(null)
  }

  return (
    <YusukeModalContext.Provider value={{ openEntry }}>
      {children}
      <ModalDialog
        open={modalState !== null}
        title={modalState?.title ?? ""}
        onClose={handleClose}
      >
        <MarkdownViewer markdown={modalState?.content ?? ""} />
      </ModalDialog>
    </YusukeModalContext.Provider>
  )
}
