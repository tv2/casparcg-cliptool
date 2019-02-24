
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

    overlay(item, indexChannel) {
        const thumbIndex = this.store.data[0].channel[indexChannel].thumbActiveIndex;
        const metaData = this.store.data[0].channel[indexChannel].thumbList[thumbIndex].metaList;
        const overlayFolder = this.store.settings[0].tabData[indexChannel].overlayFolder;

        if (overlayFolder != '' && !this.store.data[0].ccgInfo[indexChannel].layers[9].foreground.paused) {
            metaData.map((metaItem) => {
                metaItem.layer = metaItem.layer || 20;
                if (metaItem.startTime < 0.08) {
                    metaItem.startTime = 0.08;
                }
                if (metaItem.startTime < item.time && item.time < (metaItem.startTime + 0.0799) && !this.overlayIsStarted[indexChannel][metaItem.layer]) {
                    console.log("Lower third on: ", metaItem.startTime, item.time, metaItem.templateData[0].data);
                    this.ccgConnection.cgAdd(
                        1, metaItem.layer, 1,
                        overlayFolder + metaItem.templatePath,
                        1,
                        this.metaDataToXml(metaItem)
                    );
                    this.overlayIsStarted[indexChannel][metaItem.layer] = true;
                } else if ((metaItem.startTime + metaItem.duration) < item.time && item.time < (metaItem.startTime + metaItem.duration + 0.0799) && !this.overlayIsStarted[indexChannel][metaItem.layer]) {
                    console.log("Lower third OFF: ", (metaItem.startTime + metaItem.duration), item.time, metaItem.templateData[0].data);
                    this.ccgConnection.clear(indexChannel + 1, metaItem.layer);
                    this.overlayIsStarted[indexChannel][metaItem.layer] = true;
                } else {
                    this.overlayIsStarted[indexChannel][metaItem.layer] = false;
                }

            });
        }
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
        metaData.templateData.map((item) => {
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
