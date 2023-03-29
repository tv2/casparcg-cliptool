import { State } from '../reducers/index-reducer'
import { Output as Output, ThumbnailFile } from '../reducers/media-models'
import { reduxState } from '../reducers/store'
import appNavigationService from './app-navigation-service'

class MediaService {
    public getOutput(
        store: State = reduxState,
        channelIndex: number = -1
    ): Output {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab(reduxState.appNavigation)
                : channelIndex
        return store.media.outputs[activeTab]
    }

    public getOutputs(store: State = reduxState): Output[] {
        return store.media.outputs
    }

    public findThumbnail(fileName: string, channelIndex: number): string {
        const output = this.getOutput(reduxState, channelIndex)
        if (!output || !output.thumbnailList) {
            return ''
        }
        //console.log('Output', output)
        const thumbnailFile = output.thumbnailList.find(
            (item: ThumbnailFile) =>
                item.name.toUpperCase() === fileName.toUpperCase()
        )
        return thumbnailFile?.thumbnail ?? ''
    }

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

    leadingZero(num: number, length: number = 2): string {
        const text = num.toString()
        const zeros = '0'.repeat(Math.max(0, length - text.length))
        return `${zeros}${text}`
    }
}

const mediaService: MediaService = new MediaService()
export default mediaService
