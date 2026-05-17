import { Tabs, type TabId } from "./components/Tabs"
import { renderTabContent } from "./render-tab-content"
import { YusukeModalProvider } from "./modal-context"

export function YusukeApp({ defaultTab = "career" }: { defaultTab?: TabId }) {
  return (
    <YusukeModalProvider>
      <Tabs defaultTab={defaultTab}>{renderTabContent}</Tabs>
    </YusukeModalProvider>
  )
}
