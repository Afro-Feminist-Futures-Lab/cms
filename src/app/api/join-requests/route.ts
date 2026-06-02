import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return Response.json({ message: 'Name and email are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if email already exists - unauthenticated query
    const existing = await payload.find({
      collection: 'join-requests',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return Response.json(
        { message: 'This email is already registered' },
        { status: 400 }
      )
    }

    // Create new join request
    const result = await payload.create({
      collection: 'join-requests',
      data: {
        email,
        name,
        status: 'pending',
      },
      overrideAccess: false,
    })

    return Response.json(
      {
        message: 'Thank you for registering! We will be in touch soon.',
        id: result.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Join request error:', error)
    return Response.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
