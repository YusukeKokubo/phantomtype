import { html } from "hono/html"

export default function YusukePage() {
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

        {/* タブUIコンテナ（クライアントコンポーネントで初期化） */}
        <div id="yusuke-tabs-container"></div>

        {/* クライアントコンポーネントのスクリプト */}
        {html`
          <script
            type="module"
            src="/src/yusuke/client/yusuke-tabs.tsx"
          ></script>
        `}
      </main>

      {/* ポップアップモーダル（Client Component） */}
      <div id="yusuke-modal-container"></div>
      {html`
        <script
          type="module"
          src="/src/yusuke/client/yusuke-modal.tsx"
        ></script>
      `}
    </>
  )
}
