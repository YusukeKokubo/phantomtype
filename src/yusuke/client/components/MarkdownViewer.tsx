import { useEffect, useRef } from "hono/jsx"

// HTMLエンティティをデコードする関数
function decodeHtmlEntity(str: string): string {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = str
  return textarea.value
}

// シンプルなMarkdownからHTMLへの変換
function markdownToHtml(markdown: string): string {
  // 改行文字を実際の改行に変換（\\n -> \n）
  let html = markdown.replace(/\\n/g, "\n")

  // 水平線（最初に処理）
  html = html.replace(/^---$/gim, '<hr class="my-6 border-border" />')

  // 見出し
  html = html.replace(
    /^### (.*)$/gim,
    '<h3 class="text-lg font-light mb-2 mt-4 text-foreground">### $1</h3>'
  )
  html = html.replace(
    /^## (.*)$/gim,
    '<h2 class="text-xl font-light mb-3 mt-8 text-foreground border-b border-border pb-2">## $1</h2>'
  )
  html = html.replace(
    /^# (.*)$/gim,
    '<h1 class="text-2xl font-light mb-4 mt-8 text-foreground"># $1</h1>'
  )

  // リスト（連続するリスト項目を1つのulで囲む）
  html = html.replace(/^(- .*(\n- .*)*)/gim, function (match) {
    const items = match
      .split(/\n-/)
      .map(function (item, index) {
        const text = index === 0 ? item.replace(/^- /, "") : item.trim()
        return '<li class="ml-4 mb-1 text-foreground">' + text + "</li>"
      })
      .join("")
    return '<ul class="list-disc mb-4 text-foreground">' + items + "</ul>"
  })

  // 太字
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // リンク
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-text-secondary underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">$1</a>'
  )

  // 段落（空行で区切られた部分を段落にする）
  html = html
    .split(/\n\n/)
    .map(function (para) {
      para = para.trim()
      if (!para) return ""
      // 既にHTMLタグが含まれている場合はそのまま
      if (para.match(/^<[hul]/)) {
        return para
      }
      // 改行を<br />に変換
      para = para.replace(/\n/g, "<br />")
      return '<p class="mb-4 text-foreground">' + para + "</p>"
    })
    .filter(function (p) {
      return p
    })
    .join("")

  return '<div class="space-y-4">' + html + "</div>"
}

interface MarkdownViewerProps {
  markdown: string
}

export function MarkdownViewer({ markdown }: MarkdownViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && markdown) {
      const decodedMarkdown = decodeHtmlEntity(markdown)
      const htmlContent = markdownToHtml(decodedMarkdown)
      contentRef.current.innerHTML = htmlContent
    }
  }, [markdown])

  return (
    <div
      ref={contentRef}
      id="yusuke-modal-content"
      class="p-6 flex-1 text-foreground max-w-none"
    />
  )
}
