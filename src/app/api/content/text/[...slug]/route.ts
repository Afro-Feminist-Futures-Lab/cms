import { getPayload } from 'payload'
import config from '@payload-config'
import { stripToText } from '@/utilities/extractText'

/**
 * GET /api/content/text/[collection]
 * GET /api/content/text/[collection]/[id]
 *
 * Returns text-only content from any collection
 * Strips all HTML, formatting, and nested relationships
 * Ideal for search indexing, text analysis, or minimal bandwidth
 *
 * Examples:
 * - /api/content/text/pages - Get all pages (text only)
 * - /api/content/text/posts - Get all posts (text only)
 * - /api/content/text/categories - Get all categories (text only)
 * - /api/content/text/pages/507f1f77bcf86cd799439011 - Get specific page
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params

    if (!slug || slug.length < 1) {
      return Response.json(
        {
          error: 'Invalid request. Use /api/content/text/[collection] or /api/content/text/[collection]/[id]',
        },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const collection = slug[0]
    const id = slug[1]

    // Validate collection exists
    const validCollections = Object.values(payload.collections as Record<string, any>).map(
      (c) => c.config.slug
    )
    if (!validCollections.includes(collection)) {
      return Response.json(
        { error: `Collection '${collection}' not found`, validCollections },
        { status: 404 }
      )
    }

    // Determine content type for extraction
    const contentType =
      collection === 'pages' ? 'page' : collection === 'posts' ? 'post' : 'generic'

    // Get a single document by ID or slug
    if (id) {
      try {
        // Try as ID first
        const doc = await payload.findByID({
          collection: collection as any,
          id,
          depth: 10,
          draft: false,
        })

        const textContent = stripToText(doc, contentType)
        return Response.json(textContent)
      } catch {
        // Try as slug if ID fails
        try {
          const result = await payload.find({
            collection: collection as any,
            where: {
              slug: { equals: id },
            },
            depth: 10,
            draft: false,
            limit: 1,
          })

          if (result.docs.length === 0) {
            return Response.json(
              {
                error: `Document with ID or slug '${id}' not found in collection '${collection}'`,
              },
              { status: 404 }
            )
          }

          const textContent = stripToText(result.docs[0], contentType)
          return Response.json(textContent)
        } catch (error) {
          return Response.json(
            {
              error: `Document not found: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
            { status: 404 }
          )
        }
      }
    }

    // Get all documents from collection
    const allDocs = await payload.find({
      collection: collection as any,
      depth: 10,
      draft: false,
      limit: 1000,
      pagination: false,
    })

    // Extract text from each document
    const textDocs = allDocs.docs.map((doc) => stripToText(doc, contentType))

    return Response.json({
      docs: textDocs,
      totalDocs: allDocs.totalDocs,
    })
  } catch (error) {
    console.error('Text API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
