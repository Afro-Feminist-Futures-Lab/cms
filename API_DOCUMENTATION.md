# Headless Content API Documentation

This API provides pure data access to all Payload CMS content with no styling, components, or HTML rendering. Perfect for custom frontends, external applications, or integrations.

## Quick Start

### Get All Pages
```bash
curl https://yourdomain.com/api/content/pages
```

### Get Specific Page by Slug
```bash
curl 'https://yourdomain.com/api/content/pages?slug=about'
```

### Get All Posts
```bash
curl https://yourdomain.com/api/content/posts
```

### Get Specific Post
```bash
curl 'https://yourdomain.com/api/content/posts?slug=my-first-post'
```

## Endpoints

### Generic Content Endpoint
Fetch content from any collection without needing specific routes.

**GET** `/api/content/[collection]`
**GET** `/api/content/[collection]/[id-or-slug]`

Returns all published documents from any collection with relationships fully populated.

#### Examples
```bash
# Get all categories
curl https://yourdomain.com/api/content/categories

# Get all users
curl https://yourdomain.com/api/content/users

# Get all join requests
curl https://yourdomain.com/api/content/join-requests

# Get specific document by ID
curl https://yourdomain.com/api/content/pages/507f1f77bcf86cd799439011

# Get specific document by slug
curl https://yourdomain.com/api/content/pages/home
```

### Pages Endpoint
Specialized endpoint for page content with query parameter support.

**GET** `/api/content/pages`
**GET** `/api/content/pages?slug=page-slug`

#### Query Parameters
- `slug` - Get a specific page by slug
- `depth` - Control relationship nesting depth (1-20, default: 10)
- `limit` - Number of documents to return (1-1000, default: 1000)

#### Examples
```bash
# Get all pages
curl https://yourdomain.com/api/content/pages

# Get specific page
curl 'https://yourdomain.com/api/content/pages?slug=home'

# Limit relationships depth for lighter response
curl 'https://yourdomain.com/api/content/pages?depth=2'

# Get first 5 pages
curl 'https://yourdomain.com/api/content/pages?limit=5'
```

### Posts Endpoint
Specialized endpoint for blog posts with sorting and filtering.

**GET** `/api/content/posts`
**GET** `/api/content/posts?slug=post-slug`

#### Query Parameters
- `slug` - Get a specific post by slug
- `depth` - Control relationship nesting depth (1-20, default: 10)
- `limit` - Number of documents to return (1-1000, default: 100)
- `sort` - Sort field (default: `-publishedAt`, use `-` for descending)

#### Examples
```bash
# Get all published posts, latest first
curl https://yourdomain.com/api/content/posts

# Get specific post
curl 'https://yourdomain.com/api/content/posts?slug=my-post'

# Get latest 10 posts
curl 'https://yourdomain.com/api/content/posts?limit=10'

# Sort by title (A-Z)
curl 'https://yourdomain.com/api/content/posts?sort=title'

# Limit relationship nesting
curl 'https://yourdomain.com/api/content/posts?depth=3'
```

## Response Format

All endpoints return raw Payload data in JSON format:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "My Page Title",
  "slug": "my-page-title",
  "hero": {
    "type": "highImpact",
    "richText": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Welcome to my page"
          }
        ]
      }
    ]
  },
  "layout": [
    {
      "blockType": "content",
      "columns": [
        {
          "size": "oneThird",
          "richText": [...]
        }
      ]
    }
  ],
  "meta": {
    "title": "SEO Title",
    "description": "SEO Description",
    "image": {
      "id": "507f1f77bcf86cd799439012",
      "alt": "Image alt text",
      "filename": "image.png",
      "url": "/media/image.png"
    }
  },
  "publishedAt": "2026-05-31T10:00:00.000Z",
  "createdAt": "2026-05-30T10:00:00.000Z",
  "updatedAt": "2026-05-31T11:00:00.000Z"
}
```

## Usage Examples

### JavaScript/React

```javascript
// Fetch a page
async function getPage(slug) {
  const res = await fetch(`/api/content/pages?slug=${slug}`)
  return res.json()
}

// Fetch all posts
async function getPosts() {
  const res = await fetch('/api/content/posts')
  return res.json()
}

// Use in component
export default async function PageRenderer({ slug }) {
  const page = await getPage(slug)
  
  return (
    <div>
      <h1>{page.title}</h1>
      {/* Render content with your custom design system */}
      {page.layout.map(block => renderBlock(block))}
    </div>
  )
}
```

### External App/Website

```javascript
// Fetch from external domain
const response = await fetch('https://mycms.com/api/content/posts')
const posts = await response.json()

// Build your own UI
posts.docs.forEach(post => {
  console.log(`${post.title} - ${post.slug}`)
})
```

### Third-party Integrations

Use these endpoints to integrate with:
- Static site generators (Hugo, Jekyll, Eleventy)
- Mobile apps
- External analytics platforms
- AI/ML pipelines
- Data analysis tools

## Response Codes

- `200 OK` - Content found and returned
- `404 NOT FOUND` - Collection or document not found
- `400 BAD REQUEST` - Invalid parameters
- `500 INTERNAL SERVER ERROR` - Server error

## Rate Limiting

No rate limiting by default. Implement as needed for production use.

## Authentication

These endpoints return only published content. Authenticated requests can be added if needed.

To access draft content or unpublished material, use the [Payload Local API](https://payloadcms.com/docs/local-api) from server-side code.

## Performance Tips

1. **Limit Depth** - Use `?depth=2` or `?depth=3` for faster responses
2. **Use Slugs** - Slugs are indexed, faster than IDs
3. **Cache Responses** - Cache API responses in your application
4. **Pagination** - Implement manual pagination in your frontend if dealing with many items

## Extending the API

To add more specialized endpoints, create new files in `src/app/api/content/`:

```typescript
// src/app/api/content/events/route.ts
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const events = await payload.find({
    collection: 'events',
    // Custom logic here
  })
  return Response.json(events)
}
```

Then use: `GET /api/content/events`
