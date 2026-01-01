import { useState, useEffect } from "hono/jsx"

export type TabId = "career" | "personal" | "values" | "blog"

interface Tab {
  id: TabId
  label: string
}

interface TabsProps {
  defaultTab?: TabId
  children: (activeTab: TabId) => any
}

const tabs: Tab[] = [
  { id: "career", label: "career" },
  { id: "personal", label: "personal" },
  { id: "values", label: "values" },
  { id: "blog", label: "blog" },
]

// URLハッシュからタブIDを取得
function getTabFromHash(): TabId | null {
  const hash = window.location.hash.slice(1) // '#'を除去
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

// タブIDをURLハッシュに設定
function setTabToHash(tabId: TabId) {
  window.location.hash = tabId
}

export function Tabs({ defaultTab = "career", children }: TabsProps) {
  // URLハッシュから初期値を取得、なければdefaultTabを使用
  const [activeTab, setActiveTab] = useState<TabId>(
    getTabFromHash() || defaultTab
  )

  // 初期化時にURLハッシュを設定（ハッシュがない場合）
  useEffect(() => {
    if (!getTabFromHash()) {
      setTabToHash(activeTab)
    }
  }, [])

  // ハッシュ変更をリッスン（ブラウザの戻る/進むボタン対応）
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

  // タブ変更時にURLハッシュも更新
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    setTabToHash(tabId)
  }

  return (
    <div class="w-full">
      <div
        class="flex border-b border-border mb-6"
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
              class={`px-6 py-3 text-sm font-light border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
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
