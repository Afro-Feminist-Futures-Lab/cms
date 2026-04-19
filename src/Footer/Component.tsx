import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'
import { FooterClient } from './Component.client'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  return (
    <FooterClient
      contactEmail={process.env.CONTACT_EMAIL}
      data={footerData}
      socialInstagram={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
      socialTwitter={process.env.NEXT_PUBLIC_TWITTER_URL}
    />
  )
}
