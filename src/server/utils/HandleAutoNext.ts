import { reduxState } from '../../model/reducers/store'
/*
class HandleAutoNext {
    ccgLoadPlay: any
    constructor(ccgLoadPlay) {
        this.ccgLoadPlay = ccgLoadPlay
    }

    isAutoNextStopped() {
        reduxState.data[0].channel.forEach((item, channelIndex) => {
            if (reduxState.settings[0].tabData[channelIndex].autoPlay) {
                if (
                    reduxState.data[0].ccgInfo[channelIndex].layers[9]
                        .foreground.paused
                ) {
                    this.ccgLoadPlay.playMedia(channelIndex + 1, 10, 0, 0)
                }
            }
        })
    }

    autoNext(item, channelIndex) {
        if (reduxState.settings[0].tabData[channelIndex].autoPlay) {
            //Load Next Clip:
            if (1.45 > item.timeLeft && item.timeLeft > 1.35) {
                if (
                    reduxState.data[0].channel[channelIndex].thumbActiveIndex +
                        1 <
                    reduxState.data[0].channel[channelIndex].thumbList.length
                ) {
                    this.ccgLoadPlay.loadBgMedia(
                        channelIndex + 1,
                        10,
                        reduxState.data[0].channel[channelIndex]
                            .thumbActiveIndex + 1
                    )
                } else {
                    this.ccgLoadPlay.loadBgMedia(channelIndex + 1, 10, 0)
                }
            }
        }
    }
}

export default HandleAutoNext
*/
