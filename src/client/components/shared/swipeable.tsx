import React from "react"
import { useState } from "react"
import swipeService, { Point, SwipeDirection } from "../../services/swipe-service"

interface SwipeableProps {
  divClassName?: string
  role?: React.AriaRole
  onSwipe: (direction: SwipeDirection) => void
  children: React.ReactNode
  allowSwipe?: boolean
}

export default function Swipeable(props: SwipeableProps): JSX.Element {
  const [touchStart, setTouchStart] = useState<Point | null>(null)
  const [touchEnd, setTouchEnd] = useState<Point | null>(null)

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    if (props.allowSwipe) {
      return
    }
    setTouchEnd(null)
    setTouchStart(swipeService.getEventPoint(event))
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    if (props.allowSwipe) {
      return
    }
    setTouchEnd(swipeService.getEventPoint(event))
  }

  function onTouchEnd(): void {
    if (!touchStart || !touchEnd || props.allowSwipe){
      return
    }
    if (!swipeService.isValidSwipe(touchStart, touchEnd)) {
      return
    }
    const direction = swipeService.getSwipeDirection(touchStart, touchEnd)
    props.onSwipe(direction)
    
  }

  return (
    <div className={props.divClassName} 
      role={props.role}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {props.children}
    </div> 

  )
}