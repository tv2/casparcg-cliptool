import { Output as Output, ThumbnailFile } from '../reducers/mediaModels'
import { OutputSettings } from '../reducers/settingsModels'
import { reduxState, ReduxStateType } from '../reducers/store'
import appNavigationService from './appNavigationService'
import settingsService from './settingsService'

class MediaService {
    public getOutput(
        store: ReduxStateType = reduxState,
        channelIndex: number = -1
    ): Output {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return store.media.outputs[activeTab]
    }

    public getOutputs(store: ReduxStateType = reduxState): Output[] {
        return store.media.outputs
    }

    public findThumbnail(fileName: string, channelIndex: number): string {
        const output = this.getOutput(reduxState, channelIndex)
        if (!output || !output.thumbnailList) {
            return ''
        }
        const thumbnailFile = output.thumbnailList.find(
            (item: ThumbnailFile) =>
                item.name.toUpperCase() === fileName.toUpperCase()
        )
        return thumbnailFile?.thumbnail ?? ''
    }

    public isThumbnailSelected(thumbnailName: string): boolean {
        const selectedFileName = this.getCleanSelectedFile(
            settingsService.getOutputSettings()
        )
        return selectedFileName === thumbnailName
    }

    public isThumbnailSelectedOnAnyOutput(thumbnailName: string): boolean {
        return settingsService
            .getGenericSettings()
            .outputs.some(
                (output) => this.getCleanSelectedFile(output) === thumbnailName
            )
    }

    public getCleanSelectedFile(output: OutputSettings): string {
        const selectedFileName = output.selectedFile
            .toUpperCase()
            .replace(/\\/g, '/')
            .replace('//', '/')
            .split('.')
        // Remove system Path e.g.: D:\\media/:
        const cleanSelectedFileName = selectedFileName[0].replace(
            reduxState.settings.ccgConfig.path
                ?.toUpperCase()
                .replace(/\\/g, '/') + '/',
            ''
        )
        return cleanSelectedFileName
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
