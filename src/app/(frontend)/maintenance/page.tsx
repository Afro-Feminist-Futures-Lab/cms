'use client'

import React, { useState } from 'react'

import '../landing-theme.css'

export default function MaintenancePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubscribe(formData: FormData) {
    try {
      setIsLoading(true)
      setError(null)

      const email = String(formData.get('email') || '')
      const name = String(formData.get('name') || '')

      if (!email || !name) {
        setError('Please enter your name and email')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/join-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to register')
      }

      setSuccess(true)
      ;(document.querySelector('[name="email"]') as HTMLInputElement).value = ''
      ;(document.querySelector('[name="name"]') as HTMLInputElement).value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="affl-maintenance" data-maintenance="true">
      <div className="affl-maintenance-stars"></div>

      <div className="affl-maintenance-content">
        <div className="affl-maintenance-left">
          <h1 style={{ fontSize: "29px" }}>Welcome to AFFL</h1>

          <div className="affl-maintenance-text">
            <p className="affl-maintenance-intro">
              <strong>Join AFFL</strong>
            </p>
            <p>
              While we continue building this space, you can choose how you'd like to stay connected.
            </p>
            <p>
              You can sign up for newsletter updates to follow our progress, or register your interest
              to join the platform.
            </p>
            <p>
              Requests to join are reviewed as we gradually open access. This is part of how AFFL will
              operate – helping us shape a space that is intentional, safe, and centred on the communities
              it is designed to support.
            </p>
            <p>You'll be notified once access becomes available or your request is approved.</p>
          </div>

          <form action={handleSubscribe} className="affl-maintenance-form">
            <label htmlFor="maintenance-name">Name</label>
            <input
              autoComplete="name"
              id="maintenance-name"
              name="name"
              placeholder="Your name"
              required
              type="text"
            />
            <label htmlFor="maintenance-email">Email</label>
            <input
              autoComplete="email"
              id="maintenance-email"
              name="email"
              placeholder="your@email.com"
              required
              type="email"
            />
            {error && !success ? (
              <p className="affl-maintenance-error">{error}</p>
            ) : null}
            {success ? (
              <p className="affl-maintenance-success">Thank you! We'll be in touch soon.</p>
            ) : null}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe to updates'}
            </button>
          </form>
        </div>

        <div className="affl-maintenance-right"> 
          <div className="affl-maintenance-logo">
            <img src="/Logo AFFL.png" alt="AFFL Logo" />
          </div>
          
          <div className="affl-maintenance-cta">
            <p>Register your interest to be considered for access</p>
            <p style={{ color: "#FFFF5C", fontSize: "14px" }}>Request to join AFFL</p>
            <a href="#register" className="affl-maintenance-register-btn">
              Request to join AFFL
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
