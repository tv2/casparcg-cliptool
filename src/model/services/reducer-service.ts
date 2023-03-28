import { Media } from '../reducers/mediaModels'

class ReducerService {
    doesMediaOutputChannelExist(
        nextState: Media,
        channelIndex: number
    ): boolean {
        return nextState.outputs.length > channelIndex
    }
}

const reducerService = new ReducerService()
export default reducerService
