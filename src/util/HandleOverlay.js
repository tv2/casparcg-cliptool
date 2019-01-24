
class HandleOverlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
    }

    overlay(item, indexChannel) {
        const thumbIndex = this.store.dataReducer[0].data.channel[indexChannel].thumbActiveIndex;
        const metaData = this.store.dataReducer[0].data.channel[indexChannel].thumbList[thumbIndex].metaList;
        const overlayFolder = this.store.settingsReducer[0].settings.tabData[indexChannel].overlayFolder;

        if (item.time < 0.14) {
            console.log(
                ' Index : ', this.store.dataReducer[0].data.channel[indexChannel].thumbActiveIndex,
                ' Paused : ', this.store.dataReducer[0].data.ccgInfo[indexChannel].layers[9].foreground.paused,
                ' Time :', item.time
            );
        }

        if (overlayFolder != '' && !this.store.dataReducer[0].data.ccgInfo[indexChannel].layers[9].foreground.paused) {
            metaData.map((metaItem) => {
                if (metaItem.startTime < 0.08) {
                    metaItem.startTime = 0.08;
                }
                if (metaItem.startTime < item.time && item.time < (metaItem.startTime + 0.09)) {
                    console.log("Lower third on: ", metaItem.startTime, item.time, metaItem.templateData[0].data);
                    this.ccgConnection.cgAdd(
                        1,20, 1,
                        overlayFolder + metaItem.templatePath,
                        1,
                        this.metaDataToXml(metaItem)
                    );
                }
                if ((metaItem.startTime + metaItem.duration) < item.time && item.time < (metaItem.startTime + metaItem.duration + 0.08)) {
                    console.log("Lower third OFF: ", (metaItem.startTime + metaItem.duration), item.time, metaItem.templateData[0].data);
                    this.ccgConnection.clear(indexChannel + 1, 20);
                }

                //ToDo: only fire once.
                let wipeOffset = parseFloat(this.store.settingsReducer[0].settings.tabData[indexChannel].wipeOffset);
                if (wipeOffset < item.timeLeft && item.timeLeft < (wipeOffset + 0.5) && this.store.settingsReducer[0].settings.tabData[indexChannel].autoPlay) {
                    this.ccgConnection.play(1, 11, this.store.settingsReducer[0].settings.tabData[indexChannel].wipe);
                }
            });
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
