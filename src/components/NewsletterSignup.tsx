'use client'

import React, { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Enter a valid email to subscribe.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/join-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), name: 'Newsletter signup' }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.message || 'Unable to subscribe right now.')
        return
      }

      setStatus('success')
      setMessage(data.message || 'You are subscribed!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="join" className="affl-newsletter-section" aria-label="Newsletter signup">
      <div>
        <p className="affl-eyebrow">Stay connected</p>
        <h2>Subscribe for early updates and stories</h2>
        <p>Receive launch announcements, community news, and progress updates straight to your inbox.</p>
      </div>

      <form className="affl-newsletter-form" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>

        {status === 'success' ? (
          <p className="affl-newsletter-success">{message}</p>
        ) : status === 'error' ? (
          <p className="affl-newsletter-error">{message}</p>
        ) : null}
      </form>
    </section>
  )
}
