import { getPayload } from 'payload'
import config from '@payload-config'
import { extractPageText, extractPostText } from '@/utilities/extractText'

/**
 * GET /api/content/text/pages
 * GET /api/content/text/pages?slug=page-slug
 *
 * Returns text-only content from pages
 * All rich text is converted to plain text, no HTML or formatting
 *
 * Examples:
 * - /api/content/text/pages - Get all pages (text only)
 * - /api/content/text/pages?slug=home - Get specific page (text only)
 * - /api/content/text/pages?limit=5 - Get first 5 pages (text only)
 */

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const limit = Math.min(parseInt(searchParams.get('limit') || '1000'), 1000)
    const slug = searchParams.get('slug')

    // Get single page by slug
    if (slug) {
      const result = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
        },
        depth: 10,
        draft: false,
        limit: 1,
      })

      if (result.docs.length === 0) {
        return Response.json(
          { error: `Page with slug '${slug}' not found` },
          { status: 404 }
        )
      }

      const textContent = extractPageText(result.docs[0])
      return Response.json(textContent)
    }

    // Get all pages
    const pages = await payload.find({
      collection: 'pages',
      depth: 10,
      draft: false,
      limit,
      pagination: false,
    })

    // Extract text from each page
    const textPages = pages.docs.map(extractPageText)

    return Response.json({
      docs: textPages,
      totalDocs: pages.totalDocs,
    })
  } catch (error) {
    console.error('Text pages API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
