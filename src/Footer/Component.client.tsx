'use client'

import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import landingStyles from './FooterLanding.module.css'

type Props = {
  data: FooterType
  contactEmail?: string
  socialInstagram?: string
  socialTwitter?: string
}

export function FooterClient({
  contactEmail,
  data,
  socialInstagram,
  socialTwitter,
}: Props) {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  if (pathname === '/') {
    return (
      <footer className={landingStyles.landingFooter}>
        <div className={landingStyles.inner}>
          <div>
            <h2 className={landingStyles.columnTitle}>Links</h2>
            <ul className={landingStyles.list}>
              {navItems.map((item, i) => (
                <li key={item.id ?? i}>
                  <CMSLink className={landingStyles.link} {...item.link} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={landingStyles.columnTitle}>Contact Us</h2>
            {contactEmail ? (
              <a className={landingStyles.link} href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            ) : null}
            {(socialTwitter || socialInstagram) && (
              <div className={landingStyles.socialRow}>
                {socialTwitter ? (
                  <a className={landingStyles.link} href={socialTwitter} rel="noreferrer" target="_blank">
                    X (Twitter)
                  </a>
                ) : null}
                {socialInstagram ? (
                  <a
                    className={landingStyles.link}
                    href={socialInstagram}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
