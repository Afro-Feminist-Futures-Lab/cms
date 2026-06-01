/**
 * Utility functions to extract plain text from Payload content
 */

/**
 * Extract plain text from Payload rich text field
 * Removes all formatting and returns concatenated text
 */
export function extractTextFromRichText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return ''

  return richText
    .map((node: any) => {
      if (!node) return ''

      // Handle paragraph, heading, list items, etc.
      if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => child.text || '').join('')
      }

      // Handle text nodes directly
      if (node.text) return node.text

      return ''
    })
    .join('\n')
    .trim()
}

/**
 * Recursively remove fields from an object
 * Useful for stripping unnecessary data
 */
export function pickFields(obj: any, fieldsToKeep: string[]): any {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => pickFields(item, fieldsToKeep))
  }

  if (typeof obj !== 'object') {
    return obj
  }

  const result: any = {}
  fieldsToKeep.forEach((field) => {
    if (field in obj) {
      result[field] = pickFields(obj[field], fieldsToKeep)
    }
  })
  return result
}

/**
 * Extract text-only content from a page document
 */
export function extractPageText(page: any): {
  id: string
  title: string
  slug: string
  description: string
  content: string
  updatedAt: string
} {
  const title = page.title || ''
  const description = page.meta?.description || ''

  // Extract text from hero
  let heroText = ''
  if (page.hero?.richText) {
    heroText = extractTextFromRichText(page.hero.richText)
  }

  // Extract text from layout blocks
  let blockTexts: string[] = []
  if (page.layout && Array.isArray(page.layout)) {
    blockTexts = page.layout
      .map((block: any) => {
        if (block.blockType === 'content' && block.columns) {
          return block.columns
            .map((col: any) => {
              if (col.richText) {
                return extractTextFromRichText(col.richText)
              }
              return ''
            })
            .join('\n\n')
        }
        if (block.richText) {
          return extractTextFromRichText(block.richText)
        }
        if (block.content) {
          return typeof block.content === 'string'
            ? block.content
            : extractTextFromRichText(block.content)
        }
        return ''
      })
      .filter(Boolean)
  }

  const content = [heroText, ...blockTexts].filter(Boolean).join('\n\n')

  return {
    id: page.id,
    title,
    slug: page.slug,
    description,
    content,
    updatedAt: page.updatedAt,
  }
}

/**
 * Extract text-only content from a post document
 */
export function extractPostText(post: any): {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author?: string
  publishedAt?: string
  updatedAt: string
} {
  const title = post.title || ''
  const excerpt = post.excerpt
    ? typeof post.excerpt === 'string'
      ? post.excerpt
      : extractTextFromRichText(post.excerpt)
    : ''

  // Extract text from content
  let contentText = ''
  if (post.content && Array.isArray(post.content)) {
    contentText = extractTextFromRichText(post.content)
  } else if (post.content && typeof post.content === 'string') {
    contentText = post.content
  }

  // Extract author name if available
  const author = post.authors?.[0]?.name || undefined

  return {
    id: post.id,
    title,
    slug: post.slug,
    excerpt,
    content: contentText,
    author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  }
}

/**
 * Remove nested relationships and keep only text fields
 * Useful for lightweight API responses
 */
export function stripToText(doc: any, type: 'page' | 'post' | 'generic'): any {
  if (type === 'page') {
    return extractPageText(doc)
  } else if (type === 'post') {
    return extractPostText(doc)
  }

  // Generic: keep only basic fields
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}
