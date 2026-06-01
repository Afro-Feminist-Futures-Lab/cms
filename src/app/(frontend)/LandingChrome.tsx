'use client'

import React, { useState } from 'react'

export function LandingChrome() {
  const [open, setOpen] = useState(false)

  return (
    <div className="affl-landing-chrome">
      <div className="affl-landing-chrome-inner">
        <div className="affl-landing-badge">AF</div>
        <button
          className="affl-landing-menu"
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="affl-landing-menu-bars" />
        </button>
      </div>

      <nav className={`affl-landing-sidebar ${open ? 'is-open' : ''}`}>
        <div className="affl-landing-sidebar-body">
          <div className="affl-landing-sidebar-header">
            <span className="affl-landing-sidebar-title" id="landing-sidebar-label">Menu</span>
            <button
              className="affl-landing-sidebar-close"
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="affl-landing-sidebar-list" aria-labelledby="landing-sidebar-label">
            <li>
              <a className="affl-landing-sidebar-link" href="#values">Values</a>
            </li>
            <li>
              <a className="affl-landing-sidebar-link" href="#stories">Stories</a>
            </li>
            <li>
              <a className="affl-landing-sidebar-link" href="#community">Community</a>
            </li>
            <li>
              <a className="affl-landing-sidebar-link" href="#join">Join</a>
            </li>
          </ul>
        </div>
      </nav>

      {open && <div className="affl-landing-sidebar-backdrop" onClick={() => setOpen(false)} />}
    </div>
  )
}
