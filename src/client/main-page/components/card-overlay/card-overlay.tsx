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
  const cssClass = getCardOverlayCssClass(props.showAs)

  return (
    <div className={`c-card-overlay ${cssClass}`}>
      {props.children}
    </div>
  )
}

function getCardOverlayCssClass(cardOverlayType: CardOverlayType): string {
  switch (cardOverlayType) {
    case CardOverlayType.CUED:
      return 'c-card-overlay__cued'
    case CardOverlayType.SELECTED:
      return 'c-card-overlay__selected'
    case CardOverlayType.NONE:
    default:
      return ''
  }
}