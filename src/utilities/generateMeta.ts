import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** Absolute path for Open Graph URL, e.g. `/` for the landing page. */
  canonicalPath?: string
}): Promise<Metadata> => {
  const { doc, canonicalPath } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | AFFL Admin Dashboard'
    : 'AFFL Admin Dashboard'

  const ogUrl = canonicalPath
    ? `${getServerSideURL()}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : doc?.slug && typeof doc.slug === 'string'
      ? `${getServerSideURL()}/${doc.slug}`
      : getServerSideURL()

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: ogUrl,
    }),
    title,
  }
}
