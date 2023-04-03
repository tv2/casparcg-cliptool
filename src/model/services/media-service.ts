import { State } from '../reducers/index-reducer'
import { Output as Output, ThumbnailFile } from '../reducers/media-models'
import appNavigationService from './app-navigation-service'

class MediaService {
    public getOutput(state: State, channelIndex: number = -1): Output {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab(state.appNavigation)
                : channelIndex
        return state.media.outputs[activeTab]
    }

    public getOutputs(store: State): Output[] {
        return store.media.outputs
    }

    public getBase64ThumbnailUrl(
        fileName: string,
        channelIndex: number,
        state: State
    ): string {
        const output = this.getOutput(state, channelIndex)
        if (!output || !output.thumbnailList) {
            return ''
        }
        const thumbnailFile = output.thumbnailList.find(
            (item: ThumbnailFile) =>
                item.name.toUpperCase() === fileName.toUpperCase()
        )
        return thumbnailFile?.thumbnail ?? ''
    }
}

const mediaService: MediaService = new MediaService()
export default mediaService
