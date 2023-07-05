import React from 'react'

interface FooterProps {
  children: React.ReactNode
}

export function Footer({ children }: FooterProps): JSX.Element {
  return (
    <footer className='footer'>
      { children }
    </footer>
  )
}