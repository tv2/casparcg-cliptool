
class HandleOverlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
    }

    overlay(item, indexChannel, thumbIndex) {
        const metaData = this.store.dataReducer[0].data.channel[indexChannel].thumbList[thumbIndex].metaList[0];
        const overlayFolder = this.store.settingsReducer[0].settings.tabData[indexChannel].overlayFolder;
        if (overlayFolder != '') {
            if (1.05 < item.timeLeft && item.timeLeft < 1.10) {
                this.ccgConnection.clear(1,20);
            }
            if (metaData.startTime < item.time && item.time < (metaData.startTime + 0.08)) {
                this.ccgConnection.cgAdd(
                    1,20, 1,
                    overlayFolder + metaData.templatePath,
                    1,
                    "<templateData><componentData id=\""+ metaData.templateData[0].id
                    + "\"><data id=\"" + metaData.templateData[0].type
                    + "\" value=\"" + metaData.templateData[0].data
                    + "\"/></componentData><componentData id=\"f1\"><data id=\"text\" value=\"\"/></componentData></templateData>"
                    );
//If Filename should be used? + extractFilenameFromPath(cleanUpFilename(this.store.dataReducer[0].data.ccgInfo[indexChannel].layers[10-1].foreground.name))
            }
            if (1.15 > item.timeLeft && item.timeLeft > 1.10 ) {
                this.ccgConnection.play(1, 11, overlayFolder + "/wipe");
            }
        }
    }


}

export default HandleOverlay;
