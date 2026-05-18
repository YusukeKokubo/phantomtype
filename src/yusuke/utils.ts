export function formatYearMonth(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

export function getRelativeTime(date: string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffMs = now.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffDays < 1) return "今日"
  if (diffDays < 7) return `${diffDays}日前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`
  if (diffMonths < 12) return `${diffMonths}ヶ月前`
  return `${diffYears}年前`
}

export function markdownToHtml(markdown: string): string {
  let html = markdown.replace(/\\n/g, "\n")

  html = html.replace(/^---$/gim, '<hr class="my-6 border-border" />')
  html = html.replace(
    /^### (.*)$/gim,
    '<h3 class="text-lg font-light mb-2 mt-4 text-foreground">### $1</h3>',
  )
  html = html.replace(
    /^## (.*)$/gim,
    '<h2 class="text-xl font-light mb-3 mt-8 text-foreground border-b border-border pb-2">## $1</h2>',
  )
  html = html.replace(
    /^# (.*)$/gim,
    '<h1 class="text-2xl font-light mb-4 mt-8 text-foreground"># $1</h1>',
  )

  html = html.replace(/^(- .*(\n- .*)*)/gim, (match) => {
    const items = match
      .split(/\n-/)
      .map((item, index) => {
        const text = index === 0 ? item.replace(/^- /, "") : item.trim()
        return `<li class="ml-4 mb-1 text-foreground">${text}</li>`
      })
      .join("")
    return `<ul class="list-disc mb-4 text-foreground">${items}</ul>`
  })

  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-text-secondary underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">$1</a>',
  )

  html = html
    .split(/\n\n/)
    .map((para) => {
      para = para.trim()
      if (!para) return ""
      if (para.match(/^<[hul]/)) return para
      para = para.replace(/\n/g, "<br />")
      return `<p class="mb-4 text-foreground">${para}</p>`
    })
    .filter(Boolean)
    .join("")

  return `<div class="space-y-4">${html}</div>`
}
