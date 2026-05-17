import { YusukeApp } from "../yusuke/client/YusukeApp"
import { getClientScript } from "../lib/client-manifest"

export default function YusukePage() {
  const defaultTab = "career"
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

        <div id="yusuke-app-container">
          <YusukeApp defaultTab={defaultTab} />
        </div>
      </main>

      <script type="module" src={clientScript} />
    </>
  )
}
