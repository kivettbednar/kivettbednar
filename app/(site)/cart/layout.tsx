import {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Cart | Kivett Bednar',
  robots: {index: false, follow: false},
}

export default function CartLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>
}
