import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { YusukeApp } from "./YusukeApp"

const appContainer = document.getElementById("yusuke-app-container")
if (appContainer) {
  createRoot(appContainer).render(
    <StrictMode>
      <YusukeApp defaultTab="career" />
    </StrictMode>,
  )
}
