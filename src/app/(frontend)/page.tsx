import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './[slug]/page.client'
import { LANDING_PAGE_SLUG } from '@/constants/landingPage'
import { getPageBySlug } from '@/utilities/getPageBySlug'
import { generateMeta } from '@/utilities/generateMeta'
import { draftMode } from 'next/headers'
import React from 'react'

import { LandingChrome } from './LandingChrome'

import './landing-theme.css'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const page = await getPageBySlug({ slug: LANDING_PAGE_SLUG })
  const url = '/'

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="affl-landing pt-0 pb-0" data-landing="true">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="affl-landing-hero">
        <LandingChrome />
        <RenderHero {...hero} />
      </div>
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug({ slug: LANDING_PAGE_SLUG })
  return generateMeta({ doc: page, canonicalPath: '/' })
}
