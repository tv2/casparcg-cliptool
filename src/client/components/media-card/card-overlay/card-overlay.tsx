import React from 'react'
import './card-overlay.scss'

interface ThumbnailOverlayProps {
  children: React.ReactNode
  className?: string
}

export default function CardOverlay(props: ThumbnailOverlayProps): JSX.Element {
  return (
    <div className={`c-card-overlay ${props.className ?? ''}`}>
      {props.children}
    </div>
  )
}