const MIN_SWIPE_DISTANCE = 50
const MAX_SWIPE_SLOPE = 0.5

enum SwipeDirection {
    LEFT = 'left',
    RIGHT = 'right',
}

export interface Point {
    x: number
    y: number
}

class SwipeService {
    public isValidSwipe(start: Point, end: Point) {
        const horizontalDistance = Math.abs(end.x - start.x)
        if (horizontalDistance < MIN_SWIPE_DISTANCE) {
            return false
        }
        const verticalDistance = Math.abs(end.y - start.y)
        const slope = verticalDistance / horizontalDistance
        return slope <= MAX_SWIPE_SLOPE
    }

    public isValidTab(tab: number, tabCount: number): boolean {
        return tab >= 0 && tab < tabCount
    }

    public getSwipeDirection(start: Point, end: Point): SwipeDirection {
        const difference = end.x - start.x
        return difference < 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT
    }

    public getNextTab(currentTab: number, direction: SwipeDirection) {
        switch (direction) {
            case SwipeDirection.LEFT: {
                return currentTab + 1
            }
            case SwipeDirection.RIGHT: {
                return currentTab - 1
            }
        }
    }

    public getEventPoint(event: React.TouchEvent<HTMLElement>): Point {
        return {
            x: event.targetTouches[0].clientX,
            y: event.targetTouches[0].clientY,
        }
    }
}

const swipeService: SwipeService = new SwipeService()
export default swipeService
