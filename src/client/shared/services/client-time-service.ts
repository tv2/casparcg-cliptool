import { FileType } from '../../../shared/models/media-models'
import { TimeService } from '../../../shared/services/time-service'

export class ClientTimeService {
    public convertDurationToTimeCode(
        timeRange: [number, number] = [0, 0],
        frameRate: number = 25,
        fileType: string
    ): string {
        if (timeRange[1] <= 0 || fileType === FileType.IMAGE) {
            return 'SELECTED'
        }

        const duration = Math.max(0, timeRange[1] - timeRange[0])
        if (duration === 0) {
            return '****END****'
        }

        return new TimeService().convertDurationToTimeCode(timeRange, frameRate)
    }
}
