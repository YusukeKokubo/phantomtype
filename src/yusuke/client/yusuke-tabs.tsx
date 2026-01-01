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

// クライアントサイドでのハイドレーション
const tabsContainer = document.getElementById("yusuke-tabs-container")
if (tabsContainer) {
  hydrateRoot(
    tabsContainer,
    <StrictMode>
      <YusukeTabs />
    </StrictMode>
  )
}
