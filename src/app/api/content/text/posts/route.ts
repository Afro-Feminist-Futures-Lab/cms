import { getPayload } from 'payload'
import config from '@payload-config'
import { extractPostText } from '@/utilities/extractText'

/**
 * GET /api/content/text/posts
 * GET /api/content/text/posts?slug=post-slug
 *
 * Returns text-only content from posts
 * All rich text is converted to plain text, no HTML or formatting
 * Perfect for search indexing, text analysis, or minimal data transfer
 *
 * Examples:
 * - /api/content/text/posts - Get all posts (text only)
 * - /api/content/text/posts?slug=my-post - Get specific post (text only)
 * - /api/content/text/posts?limit=10 - Get first 10 posts (text only)
 */

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)
    const slug = searchParams.get('slug')
    const sort = searchParams.get('sort') || '-publishedAt'

    // Get single post by slug
    if (slug) {
      const result = await payload.find({
        collection: 'posts',
        where: {
          slug: { equals: slug },
        },
        depth: 10,
        draft: false,
        limit: 1,
      })

      if (result.docs.length === 0) {
        return Response.json(
          { error: `Post with slug '${slug}' not found` },
          { status: 404 }
        )
      }

      const textContent = extractPostText(result.docs[0])
      return Response.json(textContent)
    }

    // Get all posts
    const posts = await payload.find({
      collection: 'posts',
      depth: 10,
      draft: false,
      limit,
      sort,
      pagination: false,
    })

    // Extract text from each post
    const textPosts = posts.docs.map(extractPostText)

    return Response.json({
      docs: textPosts,
      totalDocs: posts.totalDocs,
    })
  } catch (error) {
    console.error('Text posts API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
