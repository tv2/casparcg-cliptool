import React from 'react'
import '../../css/Footer.css'



interface FooterProps {
  children: React.ReactNode
}

export function Footer({ children }: FooterProps): JSX.Element {
  return (
    <footer className='Footer'>
      { children }
    </footer>
  )
}