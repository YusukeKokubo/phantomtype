import { hydrateRoot } from "hono/jsx/dom/client"
import { StrictMode } from "hono/jsx"
import { YusukeApp } from "./YusukeApp"

const appContainer = document.getElementById("yusuke-app-container")
if (appContainer) {
  hydrateRoot(
    appContainer,
    <StrictMode>
      <YusukeApp defaultTab="career" />
    </StrictMode>
  )
}
