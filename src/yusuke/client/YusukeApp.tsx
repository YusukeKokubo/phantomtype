import type { TimelineEntry } from "../../../@types/About"
import { Tabs, type TabId } from "./components/Tabs"
import { renderTabContent } from "./render-tab-content"
import { YusukeModalProvider } from "./modal-context"

interface YusukeAppProps {
  defaultTab?: TabId
  careerEntries: TimelineEntry[]
  valuesContent: string
}

export function YusukeApp({
  defaultTab = "career",
  careerEntries,
  valuesContent,
}: YusukeAppProps) {
  return (
    <YusukeModalProvider>
      <Tabs defaultTab={defaultTab}>
        {(activeTab) => renderTabContent(activeTab, careerEntries, valuesContent)}
      </Tabs>
    </YusukeModalProvider>
  )
}
