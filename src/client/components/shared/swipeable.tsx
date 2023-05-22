import React from "react"
import { useState } from "react"
import swipeService, { Point, SwipeDirection } from "../../services/swipe-service"

interface SwipeableProps {
  className?: string
  role?: React.AriaRole
  onSwipe: (direction: SwipeDirection) => void
  children: React.ReactNode
}

export default function Swipeable(props: SwipeableProps): JSX.Element {
  const [touchStart, setTouchStart] = useState<Point>()
  const [touchEnd, setTouchEnd] = useState<Point>()

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    setTouchEnd(undefined)
    setTouchStart(swipeService.getEventPoint(event))
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    setTouchEnd(swipeService.getEventPoint(event))
  }

  function onTouchEnd(): void {
    if (!touchStart || !touchEnd){
      return
    }
    if (!swipeService.isValidSwipe(touchStart, touchEnd)) {
      return
    }
    const direction = swipeService.getSwipeDirection(touchStart, touchEnd)
    props.onSwipe(direction)    
  }

  return (
    <div className={props.className ?? ''} 
      role={props.role}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {props.children}
    </div> 

  )
}