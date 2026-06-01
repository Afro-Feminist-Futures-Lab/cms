import type { Payload } from 'payload'

/**
 * Creates a default admin user if none exists.
 * This runs at Payload init time.
 * Uses credentials from environment variables:
 * - ADMIN_EMAIL (default: info@afrofeministfutureslab.com)
 * - ADMIN_PASSWORD (default: changeme123)
 */
export async function createDefaultUser({ payload }: { payload: Payload }): Promise<void> {
  try {
    const { totalDocs } = await payload.count({
      collection: 'users',
      overrideAccess: true,
    })

    if (totalDocs === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'info@afrofeministfutureslab.com'
      const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'

      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          name: 'Admin',
        } as any,
        overrideAccess: true,
      })

      payload.logger.info(`✅ Default admin user created: ${adminEmail}`)
    }
  } catch (err) {
    payload.logger.error(`❌ Failed to create default admin user: ${err instanceof Error ? err.message : String(err)}`)
  }
}
