import React, { useEffect } from "react"
import { useState } from "react"
import { reduxStore } from "../../../../shared/store"
import { setActiveTabIndex } from "../../../../shared/actions/app-navigation-action"

const MIN_SWIPE_DISTANCE = 50
const MAX_SWIPE_SLOPE = 0.5

enum SwipeDirection {
    LEFT = 'left',
    RIGHT = 'right',
}

interface Point {
    x: number
    y: number
}

interface SwipeableProps {
  role?: React.AriaRole
  children: JSX.Element[]
  activeChild: number
}

export default function Swipeable(props: SwipeableProps): JSX.Element {
  const [touchStart, setTouchStart] = useState<Point>()
  const [touchEnd, setTouchEnd] = useState<Point>()
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0)

  useEffect(() => { 
    setSelectedChildIndex(props.activeChild)
  }, [])

  useEffect(() => { 
    setSelectedChildIndex(props.activeChild)
  }, [props.activeChild])

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    setTouchEnd(undefined)
    setTouchStart(getEventPoint(event))
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    setTouchEnd(getEventPoint(event))
  }

  function onTouchEnd(): void {
    if (!touchStart || !touchEnd){
      return
    }
    if (!isValidSwipe(touchStart, touchEnd)) {
      return
    }
    const direction = getSwipeDirection(touchStart, touchEnd)
    onSwipe(direction)    
  }

  function onSwipe(direction: SwipeDirection): void {
    const nextChildIndex = getNextChild(props.activeChild, direction)
    if (!isValidIndex(nextChildIndex, props.children.length)) {
      return
    }
    reduxStore.dispatch(setActiveTabIndex(nextChildIndex))
  }

  return (
    <div 
      role={props.role}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {props.children[selectedChildIndex]}
    </div> 
  )

  function isValidSwipe(start: Point, end: Point) {
    const horizontalDistance = Math.abs(end.x - start.x)
    if (horizontalDistance < MIN_SWIPE_DISTANCE) {
        return false
    }
    const verticalDistance = Math.abs(end.y - start.y)
    const slope = verticalDistance / horizontalDistance
    return slope <= MAX_SWIPE_SLOPE
  }

  function isValidIndex(index: number, length: number): boolean {
      return index >= 0 && index < length
  }

  function getSwipeDirection(start: Point, end: Point): SwipeDirection {
      const difference = end.x - start.x
      return difference < 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT
  }

  function getNextChild(currentChild: number, direction: SwipeDirection): number {
      switch (direction) {
          case SwipeDirection.LEFT: {
              return currentChild + 1
          }
          case SwipeDirection.RIGHT: {
              return currentChild - 1
          }
      }
  }

  function getEventPoint(event: React.TouchEvent<HTMLElement>): Point {
      return {
          x: event.targetTouches[0].clientX,
          y: event.targetTouches[0].clientY,
      }
  }
}