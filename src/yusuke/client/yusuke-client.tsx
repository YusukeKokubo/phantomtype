import { hydrateRoot } from "hono/jsx/dom/client"
import { StrictMode } from "hono/jsx"
import { Tabs } from "./components/Tabs"
import { renderTabContent } from "./render-tab-content"
import { YusukeModal } from "./components/YusukeModal"

function YusukeTabs() {
  return <Tabs defaultTab="career">{renderTabContent}</Tabs>
}

const tabsContainer = document.getElementById("yusuke-tabs-container")
if (tabsContainer) {
  hydrateRoot(
    tabsContainer,
    <StrictMode>
      <YusukeTabs />
    </StrictMode>
  )
}

const modalContainer = document.getElementById("yusuke-modal-container")
if (modalContainer) {
  hydrateRoot(
    modalContainer,
    <StrictMode>
      <YusukeModal />
    </StrictMode>
  )
}
