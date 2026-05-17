import type { FC } from "hono/jsx"
import { useRequestContext } from "hono/jsx-renderer"
import { getClientScript } from "./client-manifest"

/**
 * コンポーネントにクライアント側のhydrationスクリプトを自動で注入する
 * 同じスクリプトはリクエスト内で一度だけ読み込まれる
 *
 * `c.render()` 経由（jsxRenderer 有効）でのみ利用可能。
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

    const c = useRequestContext()
    let loaded = c.get("loadedClientScripts")
    if (!loaded) {
      loaded = new Set<string>()
      c.set("loadedClientScripts", loaded)
    }

    const shouldIncludeScript = !loaded.has(script)
    if (shouldIncludeScript) {
      loaded.add(script)
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
