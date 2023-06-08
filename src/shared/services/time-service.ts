import { FileType } from '../models/media-models'

class TimeService {
    public durationToTimeCode(
        durations: [number, number] = [0, 0],
        frameRate: number = 25,
        fileType: string,
        callerIsClient: boolean = true
    ): string {
        if (
            (callerIsClient && durations[1] <= 0) ||
            (callerIsClient && fileType === FileType.IMAGE)
        ) {
            return 'SELECTED'
        }

        const time = Math.max(0, durations[1] - durations[0])
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
