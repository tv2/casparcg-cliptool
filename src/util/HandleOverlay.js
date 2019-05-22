class HandleOverlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;

        this.store = window.store.getState();
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
        this.overlayIsStarted = [];
        for (let iChannel = 0; iChannel<4; iChannel++) {
            let layerItems = [];
            for (let iLayer = 0; iLayer<30; iLayer++) {
                layerItems.push(false);
            }
            this.overlayIsStarted.push(layerItems);
        }
        this.wipeIsStarted = [false, false, false, false];
    }

    handleOverlay(item, indexChannel) {
        const thumbIndex = this.store.data[0].channel[indexChannel].thumbActiveIndex;
        const metaData = this.store.data[0].channel[indexChannel].thumbList[thumbIndex].metaList;
        const overlayFolder = this.store.settings[0].tabData[indexChannel].overlayFolder;

        if (overlayFolder != '' && !this.store.data[0].ccgInfo[indexChannel].layers[9].foreground.paused) {
            metaData.map((metaItem, elementIndex) => {
                //Reset metaItem if reloaded:
                if (item.time < 0.10) {
                    window.store.dispatch ({
                        type: 'SET_META_ELEMENT_ACTIVE',
                        index: thumbIndex,
                        tab: indexChannel,
                        elementIndex: elementIndex,
                        active: 0
                    });
                }
                if (metaItem.elementActive < 2) {

                    metaItem.layer = metaItem.layer || 20;
                    if (metaItem.startTime < 0.08) {
                        metaItem.startTime = 0.08;
                    }

                    if (metaItem.startTime < item.time && metaItem.elementActive === 0) {
                        console.log("Lower third on: ", metaItem.startTime, item.time, metaItem.templateXmlData[0].data);
                        window.store.dispatch ({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 1
                        });
                        this.ccgConnection.cgAdd(
                            1, metaItem.layer, 1,
                            overlayFolder + metaItem.templatePath,
                            1,
                            this.metaDataToXml(metaItem)
                        );
                        window.store.dispatch ({
                            type: 'SET_OVERLAY_IS_STARTED',
                            tab: indexChannel,
                            layer: metaItem.layer,
                            started: true
                        });
                    } else if ((metaItem.startTime + metaItem.duration) < item.time && metaItem.elementActive === 1) {
                        console.log("Lower third OFF: ", (metaItem.startTime + metaItem.duration), item.time, metaItem.templateXmlData[0].data);
                        window.store.dispatch ({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 2
                        });
                        this.ccgConnection.cgStop(1, metaItem.layer, 1);
                        window.store.dispatch ({
                            type: 'SET_OVERLAY_IS_STARTED',
                            tab: indexChannel,
                            layer: metaItem.layer,
                            started: false
                        });
                    }
                }
            });
        }
    }

    handleWipe(item, indexChannel) {
        //ToDo: only fire once.
        if (this.store.settings[0].tabData[indexChannel].wipe != '' &&
            this.store.settings[0].tabData[indexChannel].autoPlay
        ) {
            let wipeOffset = parseFloat(this.store.settings[0].tabData[indexChannel].wipeOffset);
            if (wipeOffset < item.timeLeft && item.timeLeft < (wipeOffset + 0.0799) && !this.wipeIsStarted) {
                this.ccgConnection.play(1, 21, this.store.settings[0].tabData[indexChannel].wipe);
                this.wipeIsStarted = true;
            } else {
                this.wipeIsStarted = false;
            }
        }
    }

    metaDataToXml(metaData) {
        let xmlString = "<templateData>"
        metaData.templateXmlData.map((item) => {
            xmlString = xmlString +
                    "<componentData id=\""+ item.id +
                    "\"><data id=\"" + item.type +
                    "\" value=\"" + item.data +
                    "\"/></componentData>";
        });
        xmlString = xmlString + "</templateData>";
        return xmlString;
    }

}

export default HandleOverlay;
