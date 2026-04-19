'use client'

import React from 'react'

/**
 * Decorative top bar for the CMS-driven landing page (logo badge + menu control).
 * Does not replace Payload navigation; pairs with the global header hidden on `/`.
 */
export function LandingChrome() {
  return (
    <div className="affl-landing-chrome">
      <div className="affl-landing-chrome-inner">
        <div className="affl-landing-badge">AF</div>
        <button className="affl-landing-menu" type="button" aria-label="Menu">
          <span className="affl-landing-menu-bars" />
        </button>
      </div>
    </div>
  )
}
