import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/content/pages
 * GET /api/content/pages/[slug]
 * 
 * Returns raw page content with all fields and relationships populated
 * No components, styling, or HTML - just the data as stored in Payload
 * 
 * Examples:
 * - /api/content/pages - Get all published pages
 * - /api/content/pages/home - Get specific page by slug
 * - /api/content/pages?limit=5 - Get first 5 pages
 * - /api/content/pages?depth=5 - Control relationship nesting depth
 */

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const depth = Math.min(parseInt(searchParams.get('depth') || '10'), 20)
    const limit = Math.min(parseInt(searchParams.get('limit') || '1000'), 1000)
    const slug = searchParams.get('slug')

    // Get single page by slug
    if (slug) {
      const result = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
        },
        depth,
        draft: false,
        limit: 1,
      })

      if (result.docs.length === 0) {
        return Response.json(
          { error: `Page with slug '${slug}' not found` },
          { status: 404 }
        )
      }

      return Response.json(result.docs[0])
    }

    // Get all pages
    const pages = await payload.find({
      collection: 'pages',
      depth,
      draft: false,
      limit,
      pagination: false,
    })

    return Response.json(pages)
  } catch (error) {
    console.error('Pages API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
