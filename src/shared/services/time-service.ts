export class TimeService {
    public convertDurationToTimeCode(
        timeRange: [number, number] = [0, 0],
        frameRate: number = 25
    ): string {
        const duration = Math.max(0, timeRange[1] - timeRange[0])
        if (duration === 0) {
            return '00:00:00.00'
        }

        const hours = Math.floor(duration / (60 * 60))
        const minutes = Math.floor((duration % (60 * 60)) / 60)
        const seconds = Math.floor(duration % 60)
        const frames = Math.floor((duration % 1) * frameRate)
        return `${this.addLeadingZero(hours)}:${this.addLeadingZero(
            minutes
        )}:${this.addLeadingZero(seconds)}.${this.addLeadingZero(frames)}`
    }

    private addLeadingZero(num: number, length: number = 2): string {
        const text = num.toString()
        const zeros = '0'.repeat(Math.max(0, length - text.length))
        return `${zeros}${text}`
    }
}
