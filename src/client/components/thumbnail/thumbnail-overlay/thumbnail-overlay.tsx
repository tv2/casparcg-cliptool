import React from 'react'
import './thumbnail-overlay.scss'

interface ThumbnailOverlayProps {
  children: React.ReactNode
  classNames?: string
}

export default function ThumbnailOverlay(props: ThumbnailOverlayProps): JSX.Element {
  return (
    <a className={`thumbnail-overlay ${props.classNames ?? ''}`}>
      {props.children}
    </a>
  )
}