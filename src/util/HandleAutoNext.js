
class HandleAutoNext {
    constructor(ccgLoadPlay) {
        this.ccgLoadPlay = ccgLoadPlay;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
    }

    autoNext(item, channelIndex) {
        if (this.store.settingsReducer[0].settings.tabData[channelIndex].autoPlay) {
            //Load Next Clip:
            if (1.45 > item.timeLeft && item.timeLeft > 1.35 ) {
                if (this.store.dataReducer[0].data.channel[channelIndex].thumbActiveIndex + 1 <
                    this.store.dataReducer[0].data.channel[channelIndex].thumbList.length
                ) {
                    this.ccgLoadPlay.loadBgMedia(channelIndex + 1, 10, this.store.dataReducer[0].data.channel[channelIndex].thumbActiveIndex+1);
                } else {
                    this.ccgLoadPlay.loadBgMedia(channelIndex + 1, 10, 0);
                }
            }
        }
    }
}

export default HandleAutoNext;
