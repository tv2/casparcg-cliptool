import React from 'react'
import './thumbnail-overlay.scss'

interface ThumbnailOverlayProps {
  children: React.ReactNode
  className?: string
}

export default function ThumbnailOverlay(props: ThumbnailOverlayProps): JSX.Element {
  return (
    <a className={`thumbnail-overlay ${props.className ?? ''}`}>
      {props.children}
    </a>
  )
}