'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const isLanding = pathname === '/'

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className={cn(
        'relative flex min-h-[80vh] items-center justify-center overflow-hidden text-white',
        isLanding ? 'mt-0' : '-mt-[10.4rem]',
      )}
      data-theme="dark"
    >
      {/* Fill images are out of document flow; keep them in a positioned layer so the track stays full width */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-[80vh] select-none items-center justify-center">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority  resource={media} />
        )}
      </div>
      <div className="container relative z-10 mb-8 flex items-center justify-center">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
