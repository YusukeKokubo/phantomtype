import { useState, useEffect } from "react"

export type TabId = "career" | "personal" | "values" | "blog"

interface Tab {
  id: TabId
  label: string
}

interface TabsProps {
  defaultTab?: TabId
  children: (activeTab: TabId) => React.ReactNode
}

const tabs: Tab[] = [
  { id: "career", label: "career" },
  { id: "personal", label: "personal" },
  { id: "values", label: "values" },
  { id: "blog", label: "blog" },
]

function getTabFromHash(): TabId | null {
  if (typeof window === "undefined") {
    return null
  }
  const hash = window.location.hash.slice(1)
  if (
    hash === "career" ||
    hash === "personal" ||
    hash === "values" ||
    hash === "blog"
  ) {
    return hash as TabId
  }
  return null
}

function setTabToHash(tabId: TabId) {
  if (typeof window !== "undefined") {
    window.location.hash = tabId
  }
}

export function Tabs({ defaultTab = "career", children }: TabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window === "undefined") {
      return defaultTab
    }
    return getTabFromHash() || defaultTab
  })

  useEffect(() => {
    if (!getTabFromHash()) {
      setTabToHash(activeTab)
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const tabFromHash = getTabFromHash()
      if (tabFromHash && tabFromHash !== activeTab) {
        setActiveTab(tabFromHash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [activeTab])

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    setTabToHash(tabId)
  }

  return (
    <div className="w-full">
      <div
        className="flex border-b border-border mb-6"
        role="tablist"
        aria-label="コンテンツタブ"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`px-6 py-3 text-sm font-light border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent text-text-secondary hover:text-foreground"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {children(activeTab)}
      </div>
    </div>
  )
}
