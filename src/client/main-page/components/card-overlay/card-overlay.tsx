import React from 'react'
import './card-overlay.scss'

export enum CardOverlayType {
  NONE = 'none',
  CUED = 'cued',
  SELECTED = 'selected'
}

interface CardOverlayProps {
  children: React.ReactNode
  showAs: CardOverlayType
}

export default function CardOverlay(props: CardOverlayProps): JSX.Element {
  return (
    <div className={`c-card-overlay ${props.showAs}`}>
      {props.children}
    </div>
  )
}