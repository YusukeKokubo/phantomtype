import { MarkdownViewer } from "../../components/MarkdownViewer"

export function ValuesContent({ content }: { content: string }) {
  if (!content) {
    return <p class="text-text-secondary">コンテンツを追加してください</p>
  }

  return <MarkdownViewer markdown={content} />
}

