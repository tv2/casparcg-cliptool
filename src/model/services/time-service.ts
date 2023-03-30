class TimeService {
    public secondsToTimeCode(
        timer: [number, number] = [0, 0],
        frameRate: number = 25,
        callerIsClient: boolean = true
    ): string {
        if (callerIsClient && timer[1] <= 0) {
            return 'SELECTED'
        }

        const time = Math.max(0, timer[1] - timer[0])
        if (time === 0) {
            return callerIsClient ? '****END****' : '00:00:00.00'
        }

        const hours = Math.floor(time / (60 * 60))
        const minutes = Math.floor((time % (60 * 60)) / 60)
        const seconds = Math.floor(time % 60)
        const frames = Math.floor((time % 1) * frameRate)
        return `${this.leadingZero(hours)}:${this.leadingZero(
            minutes
        )}:${this.leadingZero(seconds)}.${this.leadingZero(frames)}`
    }

    private leadingZero(num: number, length: number = 2): string {
        const text = num.toString()
        const zeros = '0'.repeat(Math.max(0, length - text.length))
        return `${zeros}${text}`
    }
}

const timeService: TimeService = new TimeService()
export default timeService
