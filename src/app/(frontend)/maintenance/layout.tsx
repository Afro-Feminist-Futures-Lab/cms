import type { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const metadata: Metadata = {
  title: 'Welcome to AFFL | Afro-Feminist Futures Lab',
  description: 'Join the Afro-Feminist Futures Lab. Register your interest to be part of our growing community building a digital home for Black feminist thought, dialogue, and reimagination of liberated futures.',
  openGraph: mergeOpenGraph({
    title: 'Welcome to AFFL',
    description: 'Join the Afro-Feminist Futures Lab. Register your interest to be part of our growing community.',
  }),
  robots: {
    follow: false,
    index: false,
  },
}

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children
}
