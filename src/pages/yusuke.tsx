import { Tabs } from "../yusuke/client/components/Tabs"
import { CareerContent } from "../yusuke/client/content/career/CareerContent"
import { careerEntries } from "../yusuke/client/content/career/data"
import { PersonalContent } from "../yusuke/client/content/personal/PersonalContent"
import { personalEntries } from "../yusuke/client/content/personal/data"
import { ValuesContent } from "../yusuke/client/content/values/ValuesContent"
import { valuesData } from "../yusuke/client/content/values/data"
import { BlogContent } from "../yusuke/client/content/blog/BlogContent"
import { blogEntries } from "../yusuke/client/content/blog/data"
import { ModalDialog } from "../yusuke/client/components/ModalDialog"
import { withClientScript } from "../lib/with-client-script"

// クライアント側でhydrationするコンポーネントを作成
const ClientTabs = withClientScript(
  Tabs,
  "src/yusuke/client/yusuke-tabs.tsx",
  "yusuke-tabs-container"
)

const ClientModal = withClientScript(
  ModalDialog,
  "src/yusuke/client/yusuke-modal.tsx",
  "yusuke-modal-container"
)

export default function YusukePage() {
  // サーバーサイドで初期状態（careerタブ）をレンダリング
  const defaultTab = "career"

  return (
    <>
      <a href="#main-content" class="skip-link">
        メインコンテンツへスキップ
      </a>
      <main id="main-content" class="max-w-3xl mx-auto">
        <div class="p-16">
          <p>
            <img
              src="/yusuke/jikokuten.png"
              alt="Yusuke Kokubo"
              class="w-12 h-12 border rounded"
            />
            I'm Yusuke Kokubo, a software engineer living in Nagoya, Japan🇯🇵.
          </p>
          <p>My Skills are Web Development and a bit of Web UI Design.</p>
          <p>Love cats 🐈 and photography 📷.</p>
        </div>

        {/* タブUIコンテナ（サーバーサイドでレンダリング、クライアント側でハイドレーション） */}
        <ClientTabs defaultTab={defaultTab}>
          {(activeTab) => {
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
        </ClientTabs>
      </main>

      {/* ポップアップモーダル（サーバーサイドで初期状態をレンダリング、クライアント側でハイドレーション） */}
      <ClientModal title="" onClose={() => {}}>
        <div></div>
      </ClientModal>
    </>
  )
}
