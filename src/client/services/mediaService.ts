import {
    IOutput as Output,
    IThumbnailFile,
} from '../../model/reducers/mediaReducer'
import { reduxState, ReduxStateType } from '../../model/reducers/store'
import appNavigationService from './appNavigationService'

class MediaService {
    // TODO: during UT-210, figure out the correct type to apply instead of 'any'.
    public getOutput(
        store: ReduxStateType = reduxState,
        channelIndex: number = -1
    ): Output {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return store.media[0].output[activeTab]
    }

    public findThumbnail(fileName: string, channelIndex: number): string {
        const output = this.getOutput(reduxState, channelIndex)
        const thumbnailFile = output?.thumbnailList.find(
            (item: IThumbnailFile) =>
                item.name.toUpperCase() === fileName.toUpperCase()
        )
        return thumbnailFile?.thumbnail ?? ''
    }

    public isThumbnailWithTally(thumbnailName: string): boolean {
        const tallyNoMediaPath = this.getCleanTallyFile(this.getOutput())
        return tallyNoMediaPath === thumbnailName
    }

    public isThumbnailWithTallyOnAnyOutput(thumbnailName: string): boolean {
        return reduxState.media[0].output.some(
            (output) => this.getCleanTallyFile(output) === thumbnailName
        )
    }

    public getCleanTallyFile(output: Output): string {
        const tallyFileName = output.tallyFile
            .toUpperCase()
            .replace(/\\/g, '/')
            .replace('//', '/')
            .split('.')
        // Remove system Path e.g.: D:\\media/:
        const tallyNoMediaPath = tallyFileName[0].replace(
            reduxState.settings[0].ccgConfig.path
                ?.toUpperCase()
                .replace(/\\/g, '/') + '/',
            ''
        )
        return tallyNoMediaPath
    }

    public secondsToTimeCode(
        timer: [number, number] = [0, 0],
        frameRate: number = 25
    ): string {
        if (timer[1] <= 0) {
            return 'SELECTED'
        }

        const time = Math.max(0, timer[1] - timer[0])
        if (time === 0) {
            return '****END****'
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
