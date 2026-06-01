import { getPayload } from 'payload'
import config from '@payload-config'
import { APIError } from 'payload'

/**
 * GET /api/content/[collection]/[id]
 * 
 * Returns raw content from any Payload collection with full depth
 * No components, styling, or HTML - just the data
 * 
 * Examples:
 * - /api/content/pages/home
 * - /api/content/posts/my-first-post
 * - /api/content/join-requests
 * - /api/content/media/507f1f77bcf86cd799439011
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params

    // Handle different param formats
    if (!slug || slug.length < 1) {
      return Response.json(
        { error: 'Invalid request. Use /api/content/[collection] or /api/content/[collection]/[id]' },
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

        return Response.json(doc)
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
              { error: `Document with ID or slug '${id}' not found in collection '${collection}'` },
              { status: 404 }
            )
          }

          return Response.json(result.docs[0])
        } catch (error) {
          return Response.json(
            { error: `Document not found: ${error instanceof Error ? error.message : 'Unknown error'}` },
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

    return Response.json(allDocs)
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    )
  }
}
