
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
        if (overlayFolder != '' && !this.store.dataReducer[0].data.ccgInfo[indexChannel].layers[9].paused) {
            metaData.map((metaItem) => {
                if (metaItem.startTime < item.time && item.time < (metaItem.startTime + 0.10)) {
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
                    this.ccgConnection.clear(1,20);
                }
                //ToDo: better timing of Wipe (start half the lenght) and only when autoNext is engaged
                if (1.15 > item.timeLeft && item.timeLeft > 1.10 && this.store.settingsReducer[0].settings.tabData[indexChannel].autoPlay) {
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
