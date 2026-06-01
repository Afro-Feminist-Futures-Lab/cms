import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/content/posts
 * GET /api/content/posts?slug=my-post
 * 
 * Returns raw post content with all fields and relationships populated
 * Perfect for building custom blog layouts, integrations, or external apps
 * 
 * Examples:
 * - /api/content/posts - Get all published posts
 * - /api/content/posts?slug=my-first-post - Get specific post
 * - /api/content/posts?limit=10&sort=-publishedAt - Get latest 10 posts
 * - /api/content/posts?depth=5 - Control relationship nesting depth
 */

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const depth = Math.min(parseInt(searchParams.get('depth') || '10'), 20)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)
    const sort = searchParams.get('sort') || '-publishedAt'
    const slug = searchParams.get('slug')

    // Get single post by slug
    if (slug) {
      const result = await payload.find({
        collection: 'posts',
        where: {
          slug: { equals: slug },
        },
        depth,
        draft: false,
        limit: 1,
      })

      if (result.docs.length === 0) {
        return Response.json(
          { error: `Post with slug '${slug}' not found` },
          { status: 404 }
        )
      }

      return Response.json(result.docs[0])
    }

    // Get all posts
    const posts = await payload.find({
      collection: 'posts',
      depth,
      draft: false,
      limit,
      sort,
      pagination: false,
    })

    return Response.json(posts)
  } catch (error) {
    console.error('Posts API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
