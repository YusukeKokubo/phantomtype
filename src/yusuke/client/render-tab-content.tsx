import type { TabId } from "./components/Tabs"
import { CareerContent } from "./content/career/CareerContent"
import { careerEntries } from "./content/career/data"
import { PersonalContent } from "./content/personal/PersonalContent"
import { personalEntries } from "./content/personal/data"
import { ValuesContent } from "./content/values/ValuesContent"
import { valuesData } from "./content/values/data"
import { BlogContent } from "./content/blog/BlogContent"
import { blogEntries } from "./content/blog/data"

export function renderTabContent(activeTab: TabId) {
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
}
