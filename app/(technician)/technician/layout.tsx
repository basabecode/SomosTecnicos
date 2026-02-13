import { Metadata } from 'next'
import TechnicianLayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'Portal Técnico | SomosTécnicos',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return <TechnicianLayoutClient>{children}</TechnicianLayoutClient>
}
