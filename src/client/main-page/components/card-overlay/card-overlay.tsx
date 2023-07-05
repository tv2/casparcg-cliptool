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
  let appliedCss: string = ''
  switch (props.showAs) {
    case CardOverlayType.CUED:
      appliedCss = CardOverlayType.CUED
      break
    case CardOverlayType.SELECTED:
      appliedCss = CardOverlayType.SELECTED
      break
    default: 
      appliedCss = ''
      break
  }

  return (
    <div className={`c-card-overlay ${appliedCss}`}>
      {props.children}
    </div>
  )
}