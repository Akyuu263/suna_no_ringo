export interface ComicSummary {
  id: string
  title: string
}

interface ComicList {
  items: ComicSummary[]
}

function isComicSummary(value: unknown): value is ComicSummary {
  return typeof value === 'object' && value !== null
    && 'id' in value && typeof value.id === 'string' && value.id.length > 0
    && 'title' in value && typeof value.title === 'string' && /\S/.test(value.title)
}

function isComicList(value: unknown): value is ComicList {
  if (typeof value !== 'object' || value === null || !('items' in value)
    || !Array.isArray(value.items) || !value.items.every(isComicSummary)) {
    return false
  }

  return new Set(value.items.map(comic => comic.id)).size === value.items.length
}

export async function listComics(signal: AbortSignal): Promise<ComicSummary[]> {
  const response = await fetch('/api/v1/comics', { signal })
  if (!response.ok) {
    throw new Error(`GET /api/v1/comics returned HTTP ${response.status}`)
  }

  const data: unknown = await response.json()
  if (!isComicList(data)) {
    throw new Error('Invalid comic list response')
  }
  return data.items
}
