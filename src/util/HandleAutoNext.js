
class HandleAutoNext {
    constructor(ccgLoadPlay) {
        this.ccgLoadPlay = ccgLoadPlay;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
    }

    isAutoNextStopped() {
        this.store.data[0].channel.map((item, channelIndex) => {
            if (this.store.settings[0].tabData[channelIndex].autoPlay) {
                if (this.store.data[0].ccgInfo[channelIndex].layers[9].foreground.paused) {
                    this.ccgLoadPlay.playMedia(channelIndex +1, 10, 0, 0);
                }
            }
        });
    }

    autoNext(item, channelIndex) {
        if (this.store.settings[0].tabData[channelIndex].autoPlay) {
            //Load Next Clip:
            if (1.45 > item.timeLeft && item.timeLeft > 1.35 ) {
                if (this.store.data[0].channel[channelIndex].thumbActiveIndex + 1 <
                    this.store.data[0].channel[channelIndex].thumbList.length
                ) {
                    this.ccgLoadPlay.loadBgMedia(channelIndex + 1, 10, this.store.data[0].channel[channelIndex].thumbActiveIndex+1);
                } else {
                    this.ccgLoadPlay.loadBgMedia(channelIndex + 1, 10, 0);
                }
            }
        }
    }
}

export default HandleAutoNext;
