import { Metadata } from 'next'
import CustomerLayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'Portal Cliente | SomosTécnicos',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerLayoutClient>{children}</CustomerLayoutClient>
}
