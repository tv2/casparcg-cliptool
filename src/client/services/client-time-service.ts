import { FileType } from '../../shared/models/media-models'
import timeService from '../../shared/services/time-service'

class ClientTimeService {
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

        return timeService.convertDurationToTimeCode(timeRange, frameRate)
    }
}

const clientTimeService = new ClientTimeService()
export default clientTimeService
