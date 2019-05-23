class HandleOverlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;

        this.store = window.store.getState();
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });

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

                    if (metaItem.startTime < item.time && metaItem.elementActive === 0) {
                        console.log("Lower third on: ", metaItem.startTime, item.time, metaItem.templateXmlData[0], metaItem.invokeSteps);
                        if (metaItem.htmlCcgType === 'XML') {
                            this.addXmlGfx(indexChannel, metaItem, overlayFolder);
                        } else if (metaItem.htmlCcgType === 'INVOKE') {
                            this.addInvokeGfx(indexChannel, metaItem, overlayFolder);
                        } else {
                            return error;
                        }
                        window.store.dispatch ({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 1
                        });
                        window.store.dispatch ({
                            type: 'SET_OVERLAY_IS_STARTED',
                            tab: indexChannel,
                            layer: metaItem.layer,
                            started: true
                        });
                    } else if ((metaItem.startTime + metaItem.duration) < item.time && metaItem.elementActive === 1) {
                        console.log("Lower third OFF: ", (metaItem.startTime + metaItem.duration), item.time, metaItem.templateXmlData[0], metaItem.invokeSteps);
                        if (metaItem.htmlCcgType === 'XML') {
                            this.endXmlGfx(indexChannel, metaItem);
                        } else if (metaItem.htmlCcgType === 'INVOKE') {
                            this.endInvokeGfx(indexChannel, metaItem);
                        } else {
                            return error;
                        }

                        window.store.dispatch ({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 2
                        });
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

    addXmlGfx(indexChannel, metaItem, overlayFolder) {
        this.ccgConnection.cgAdd(
            indexChannel + 1, metaItem.layer, 1,
            overlayFolder + metaItem.templatePath,
            1,
            this.metaDataToXml(metaItem)
        );
    }

    endXmlGfx(indexChannel, metaItem) {
        this.ccgConnection.cgStop(indexChannel, metaItem.layer, 1);
    }

    addInvokeGfx(indexChannel, metaItem, overlayFolder) {
        this.ccgConnection.cgAdd(
            indexChannel + 1,
            metaItem.layer,
            1,
            (overlayFolder + metaItem.templatePath),
            1,
            "<templateData></templateData>"
        )
        .then(()=>{
            this.ccgConnection.cgInvoke(
                indexChannel + 1,
                metaItem.layer,
                1,
                '"' + metaItem.invokeSteps[0] + '"'
            );
        });
    }

    endInvokeGfx(indexChannel, metaItem) {
            this.ccgConnection.cgInvoke(
                indexChannel + 1,
                metaItem.layer,
                1,
                '"' + metaItem.invokeSteps[1] + '"'
            );
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
