import {cleanUpFilename, extractFilenameFromPath} from '../util/filePathStringHandling';


class HandleOverlay {
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection;
        const unsubscribe = store.subscribe(() => {
            this.store = window.store.getState();
        });
    }

    overlay(item, channelIndex) {
        const overlayFolder = this.store.settingsReducer[0].settings.tabData[channelIndex].overlayFolder;
        if (overlayFolder != '') {
            if (1.05 < item.timeLeft && item.timeLeft < 1.10) {
                this.ccgConnection.clear(1,20);
            }
            if (0.10 < item.time && item.time < 0.14) {
                this.ccgConnection.cgAdd(
                    1,20, 1,
                    overlayFolder + "/HTML-Bundt/BUNDT",
                    1,
                    "<templateData><componentData id=\"f0\"><data id=\"text\" value=\""
                    + extractFilenameFromPath(cleanUpFilename(this.store.dataReducer[0].data.ccgInfo[channelIndex].layers[10-1].foreground.name))
                    + "\"/></componentData><componentData id=\"f1\"><data id=\"text\" value=\"\"/></componentData></templateData>"
                );
            }
            if (1.15 > item.timeLeft && item.timeLeft > 1.10 ) {
                this.ccgConnection.play(1, 11, overlayFolder + "/wipe");
            }
        }
    }
}

export default HandleOverlay;
