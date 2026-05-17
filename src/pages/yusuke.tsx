import { Tabs } from "../yusuke/client/components/Tabs"
import { renderTabContent } from "../yusuke/client/render-tab-content"
import { YusukeModal } from "../yusuke/client/components/YusukeModal"
import { getClientScript } from "../lib/client-manifest"

export default function YusukePage() {
  // サーバーサイドで初期状態（careerタブ）をレンダリング
  const defaultTab = "career"

  // クライアントスクリプトのパスを取得
  const clientScript = getClientScript("src/yusuke/client/yusuke-client.tsx")

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
          <Tabs defaultTab={defaultTab}>{renderTabContent}</Tabs>
        </div>
      </main>

      {/* ポップアップモーダル（サーバーサイドで初期状態をレンダリング、クライアント側でハイドレーション） */}
      <div id="yusuke-modal-container">
        <YusukeModal />
      </div>

      {/* クライアントスクリプト（1回だけ読み込む） */}
      <script type="module" src={clientScript} />
    </>
  )
}
