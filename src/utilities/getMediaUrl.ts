const IS_VERCEL = !!process.env.VERCEL

const resolveMediaUrl = (url: string): string => {
  if (!url.startsWith('/api/media/file/')) return url
  if (IS_VERCEL) return url.replace('/api/media/file/', '/media/')
  return url
}

export const getMediaUrl = (
  url: string | null | undefined,
  cacheTag?: string | null,
): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  const finalUrl = resolveMediaUrl(url)

  return cacheTag ? `${finalUrl}?${cacheTag}` : finalUrl
}