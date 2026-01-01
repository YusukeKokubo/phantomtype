import { useState, useEffect } from "hono/jsx"
import { hydrateRoot } from "hono/jsx/dom/client"
import { StrictMode } from "hono/jsx"
import { Tabs, type TabId } from "./components/Tabs"
import { CareerContent } from "./content/career/CareerContent"
import { careerEntries } from "./content/career/data"
import { PersonalContent } from "./content/personal/PersonalContent"
import { personalEntries } from "./content/personal/data"
import { ValuesContent } from "./content/values/ValuesContent"
import { valuesData } from "./content/values/data"
import { BlogContent } from "./content/blog/BlogContent"
import { blogEntries } from "./content/blog/data"
import { ModalDialog } from "./components/ModalDialog"
import { MarkdownViewer } from "./components/MarkdownViewer"

interface ModalState {
  title: string
  content: string
  isOpen: boolean
}

function YusukeTabs() {
  return (
    <Tabs defaultTab="career">
      {(activeTab: TabId) => {
        switch (activeTab) {
          case "career":
            return <CareerContent entries={careerEntries} />
          case "personal":
            return <PersonalContent entries={personalEntries} />
          case "values":
            return <ValuesContent content={valuesData} />
          case "blog":
            return <BlogContent entries={blogEntries} />
          default:
            return null
        }
      }}
    </Tabs>
  )
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

// クライアントサイドでのハイドレーション - Tabs
const tabsContainer = document.getElementById("yusuke-tabs-container")
if (tabsContainer) {
  hydrateRoot(
    tabsContainer,
    <StrictMode>
      <YusukeTabs />
    </StrictMode>
  )
}

// クライアントサイドでのハイドレーション - Modal
const modalContainer = document.getElementById("yusuke-modal-container")
if (modalContainer) {
  hydrateRoot(
    modalContainer,
    <StrictMode>
      <YusukeModal />
    </StrictMode>
  )
}
