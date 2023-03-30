import { State } from '../reducers/index-reducer'
import { Output as Output, ThumbnailFile } from '../reducers/media-models'
import { state } from '../reducers/store'
import appNavigationService from './app-navigation-service'

class MediaService {
    public getOutput(store: State = state, channelIndex: number = -1): Output {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab(state.appNavigation)
                : channelIndex
        return store.media.outputs[activeTab]
    }

    public getOutputs(store: State = state): Output[] {
        return store.media.outputs
    }

    public getBase64ThumbnailUrl(
        fileName: string,
        channelIndex: number
    ): string {
        const output = this.getOutput(state, channelIndex)
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
}

const mediaService: MediaService = new MediaService()
export default mediaService
