import type { FC } from "hono/jsx"
import { getClientScript } from "./client-manifest"

// スクリプトの重複読み込みを防ぐためのトラッキング
const loadedScripts = new Set<string>()

/**
 * コンポーネントにクライアント側のhydrationスクリプトを自動で注入する
 * 同じスクリプトは一度だけ読み込まれる
 *
 * @param Component - SSRでレンダリングするコンポーネント
 * @param scriptPath - クライアント側のスクリプトファイルパス（src/から始まる相対パス）
 * @param containerId - hydration対象のコンテナID（オプション、指定しない場合は自動生成）
 * @returns クライアントスクリプトが注入されたコンポーネント
 *
 * @example
 * ```tsx
 * const ClientTabs = withClientScript(
 *   Tabs,
 *   "src/yusuke/client/yusuke-client.tsx",
 *   "yusuke-tabs-container"
 * )
 *
 * // 使用
 * <ClientTabs defaultTab="career">{...}</ClientTabs>
 * ```
 */
export function withClientScript<P extends Record<string, any>>(
  Component: FC<P>,
  scriptPath: string,
  containerId?: string
): FC<P> {
  return (props: P) => {
    const script = getClientScript(scriptPath)
    const id = containerId || `client-component-${Math.random().toString(36).slice(2, 9)}`

    // スクリプトの読み込み判定（同じスクリプトは一度だけ）
    const shouldIncludeScript = !loadedScripts.has(script)
    if (shouldIncludeScript) {
      loadedScripts.add(script)
    }

    return (
      <>
        <div id={id}>
          <Component {...props} />
        </div>
        {shouldIncludeScript && <script type="module" src={script} />}
      </>
    )
  }
}
