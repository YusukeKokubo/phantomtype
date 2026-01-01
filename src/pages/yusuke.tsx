import { html } from "hono/html"
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

export default function YusukePage() {
  // 開発環境かどうかを判定（Viteのビルド時に置き換えられる）
  const isDev = typeof import.meta.env !== "undefined" && import.meta.env.DEV
  const tabsScript = isDev
    ? "/src/yusuke/client/yusuke-tabs.tsx"
    : "/client/yusuke-tabs.js"
  const modalScript = isDev
    ? "/src/yusuke/client/yusuke-modal.tsx"
    : "/client/yusuke-modal.js"

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
        <div id="yusuke-tabs-container">
          <Tabs defaultTab={defaultTab}>
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
          </Tabs>
        </div>

        {/* クライアントコンポーネントのスクリプト（hydrateRoot使用） */}
        {html` <script type="module" src="${tabsScript}"></script> `}
      </main>

      {/* ポップアップモーダル（サーバーサイドで初期状態をレンダリング、クライアント側でハイドレーション） */}
      <div id="yusuke-modal-container">
        <ModalDialog title="" onClose={() => {}}>
          <div></div>
        </ModalDialog>
      </div>
      {html` <script type="module" src="${modalScript}"></script> `}
    </>
  )
}
