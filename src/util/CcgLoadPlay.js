const MIX_DURATION = 6;

class CcgLoadPlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;

        this.store = window.store.getState();
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });

        this.pvwPlay = this.pvwPlay.bind(this);
        this.pgmPlay = this.pgmPlay.bind(this);
        this.prevCue = this.prevCue.bind(this);
        this.nextCue = this.nextCue.bind(this);
        this.playMedia = this.playMedia.bind(this);
        this.loadMedia = this.loadMedia.bind(this);
        this.loadBgMedia = this.loadBgMedia.bind(this);
    }
    pvwPlay(output) {
        this.playMedia(output, 10, this.store.data[0].channel[output-1].thumbActiveBgIndex, this.store.data[0].channel[output-1].thumbActiveIndex);
    }

    pgmPlay(output) {
        this.playMedia(output, 10, this.store.data[0].channel[output-1].thumbActiveIndex, this.store.data[0].channel[output-1].thumbActiveBgIndex);
    }

    prevCue(output) {
        if (this.store.data[0].channel[output-1].thumbActiveIndex > 0) {
            this.loadMedia(output, 10, this.store.data[0].channel[output-1].thumbActiveIndex-1);
        }
    }

    nextCue(output) {
        if (this.store.data[0].channel[output-1].thumbActiveIndex + 1 <
            this.store.data[0].channel[output-1].thumbList.length
            ) {
            this.loadMedia(output, 10, this.store.data[0].channel[output-1].thumbActiveIndex+1);
        }
    }

    playMedia(output, layer, index, indexBg) {
        this.store.data[0].channel[output-1].overlayIsStarted.map((item, index) => {
            if (item.started === true) {
                this.ccgConnection.cgClear(output, index, 1);
                window.store.dispatch ({
                    type: 'SET_OVERLAY_IS_STARTED',
                    tab: output - 1,
                    layer: index,
                    started: false,
                    templateName: "",
                });
            }
        });
        this.ccgConnection.play(
            output,
            layer,
            this.store.data[0].channel[output-1].thumbList[index].name,
            this.store.settings[0].tabData[output-1].loop,
            'MIX',
            MIX_DURATION
        );
        window.store.dispatch({
            type:'SET_MEDIA_PAUSED',
            index: (output-1),
            paused: false
        });
        this.loadBgMedia(output, 10, indexBg);
    }

    loadMedia(output, layer, index) {
        if (this.store.settings[0].tabData[output-1].autoPlay) {
            this.playMedia(output, 10, index, this.store.data[0].channel[output-1].thumbActiveBgIndex);
        } else {
            window.store.dispatch({
                type:'SET_MEDIA_PAUSED',
                index: (output-1),
                paused: true
            });
            this.ccgConnection.clear(output);

            this.store.data[0].channel[output-1].overlayIsStarted.map((item, index) => {
                window.store.dispatch ({
                    type: 'SET_OVERLAY_IS_STARTED',
                    tab: output - 1,
                    layer: index,
                    started: false,
                    templateName: "",
                });
            });

            this.ccgConnection.load(
                output,
                layer,
                this.store.data[0].channel[output-1].thumbList[index].name,
                this.store.settings[0].tabData[output-1].loop,
                'MIX',
                MIX_DURATION
            );
            this.loadBgMedia(output, 10, this.store.data[0].channel[output-1].thumbActiveBgIndex);
        }
    }

    loadBgMedia(output, layer, index) {
        if (this.store.settings[0].tabData[output-1].autoPlay) {
            this.ccgConnection.loadbgAuto(
                output,
                layer,
                this.store.data[0].channel[output-1].thumbList[index].name,
                this.store.settings[0].tabData[output-1].loop,
                'MIX',
                MIX_DURATION
            );
        } else {
            this.ccgConnection.loadbg(
                output,
                layer,
                this.store.data[0].channel[output-1].thumbList[index].name,
                this.store.settings[0].tabData[output-1].loop,
                'MIX',
                MIX_DURATION
            );
        }
    }
}

export default CcgLoadPlay;
