import { reduxStore, reduxState } from '../reducers/store'

class HandleOverlay {
    ccgConnection: any
    wipeIsStarted: any
    constructor(ccgConnection) {
        this.ccgConnection = ccgConnection

        this.wipeIsStarted = [false, false, false, false]
    }

    handleOverlay(item, indexChannel) {
        const thumbIndex =
            reduxState.data[0].channel[indexChannel].thumbActiveIndex
        const metaData =
            reduxState.data[0].channel[indexChannel].thumbList[thumbIndex]
                .metaList
        const overlayFolder =
            reduxState.settings[0].tabData[indexChannel].overlayFolder

        if (
            overlayFolder != '' &&
            !reduxState.data[0].ccgInfo[indexChannel].layers[9].foreground
                .paused
        ) {
            metaData.map((metaItem, elementIndex) => {
                //Reset metaItem if reloaded:
                if (item.time < 0.2) {
                    reduxStore.dispatch({
                        type: 'SET_META_ELEMENT_ACTIVE',
                        index: thumbIndex,
                        tab: indexChannel,
                        elementIndex: elementIndex,
                        active: 0,
                    })
                }
                if (metaItem.elementActive < 2) {
                    if (metaItem.startTime < 0.2) {
                        metaItem.startTime = 0.2
                    }

                    metaItem.layer = metaItem.layer || 20

                    if (
                        metaItem.startTime < item.time &&
                        metaItem.elementActive === 0
                    ) {
                        console.log(
                            'Lower third on: ',
                            metaItem.startTime,
                            item.time,
                            metaItem.templateXmlData[0],
                            metaItem.invokeSteps
                        )
                        if (metaItem.htmlCcgType === 'XML') {
                            this.addXmlGfx(
                                indexChannel,
                                metaItem,
                                overlayFolder
                            )
                        } else if (metaItem.htmlCcgType === 'INVOKE') {
                            this.addInvokeGfx(
                                indexChannel,
                                metaItem,
                                overlayFolder
                            )
                        } else {
                            return false
                        }
                        reduxStore.dispatch({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 1,
                        })
                        reduxStore.dispatch({
                            type: 'SET_OVERLAY_IS_STARTED',
                            tab: indexChannel,
                            layer: metaItem.layer,
                            started: true,
                            templateName: metaItem.templatePath,
                        })
                    } else if (
                        metaItem.startTime + metaItem.duration < item.time &&
                        metaItem.elementActive === 1
                    ) {
                        if (metaItem.duration === -1) {
                            return
                        }
                        console.log(
                            'Lower third OFF: ',
                            metaItem.startTime + metaItem.duration,
                            item.time,
                            metaItem.templateXmlData[0],
                            metaItem.invokeSteps
                        )
                        if (metaItem.htmlCcgType === 'XML') {
                            this.endXmlGfx(indexChannel, metaItem)
                        } else if (metaItem.htmlCcgType === 'INVOKE') {
                            this.endInvokeGfx(indexChannel, metaItem)
                        } else {
                            return false
                        }

                        reduxStore.dispatch({
                            type: 'SET_META_ELEMENT_ACTIVE',
                            index: thumbIndex,
                            tab: indexChannel,
                            elementIndex: elementIndex,
                            active: 2,
                        })
                        reduxStore.dispatch({
                            type: 'SET_OVERLAY_IS_STARTED',
                            tab: indexChannel,
                            layer: metaItem.layer,
                            started: false,
                            templateName: '',
                        })
                    }
                }
            })
        }
    }

    handleWipe(item, indexChannel) {
        //ToDo: only fire once.
        if (
            reduxState.settings[0].tabData[indexChannel].wipe != '' &&
            reduxState.settings[0].tabData[indexChannel].autoPlay
        ) {
            let wipeOffset = parseFloat(
                reduxState.settings[0].tabData[indexChannel].wipeOffset
            )
            if (
                wipeOffset < item.timeLeft &&
                item.timeLeft < wipeOffset + 0.0799 &&
                !this.wipeIsStarted
            ) {
                this.ccgConnection.play(
                    1,
                    21,
                    reduxState.settings[0].tabData[indexChannel].wipe
                )
                this.wipeIsStarted = true
            } else {
                this.wipeIsStarted = false
            }
        }
    }

    addXmlGfx(indexChannel, metaItem, overlayFolder) {
        this.ccgConnection.cgAdd(
            indexChannel + 1,
            metaItem.layer,
            1,
            overlayFolder + metaItem.templatePath,
            1,
            this.metaDataToXml(metaItem)
        )
    }

    endXmlGfx(indexChannel, metaItem) {
        this.ccgConnection.cgStop(indexChannel, metaItem.layer, 1)
    }

    addInvokeGfx(indexChannel, metaItem, overlayFolder) {
        if (
            reduxState.data[0].channel[indexChannel].overlayIsStarted[
                metaItem.layer
            ].templateName != metaItem.templatePath
        ) {
            this.ccgConnection
                .cgAdd(
                    indexChannel + 1,
                    metaItem.layer,
                    1,
                    overlayFolder + metaItem.templatePath,
                    1,
                    '<templateData></templateData>'
                )
                .then(() => {
                    this.ccgConnection.cgInvoke(
                        indexChannel + 1,
                        metaItem.layer,
                        1,
                        '"' + metaItem.invokeSteps[0] + '"'
                    )
                })
        } else {
            console.log(
                'Current Template loaded: ',
                reduxState.data[0].channel[indexChannel].overlayIsStarted[
                    metaItem.layer
                ].templateName
            )
            this.ccgConnection.cgInvoke(
                indexChannel + 1,
                metaItem.layer,
                1,
                '"' + metaItem.invokeSteps[0] + '"'
            )
        }
    }

    endInvokeGfx(indexChannel, metaItem) {
        this.ccgConnection.cgInvoke(
            indexChannel + 1,
            metaItem.layer,
            1,
            '"' + metaItem.invokeSteps[1] + '"'
        )
    }

    metaDataToXml(metaData) {
        let xmlString = '<templateData>'
        metaData.templateXmlData.map((item) => {
            xmlString =
                xmlString +
                '<componentData id="' +
                item.id +
                '"><data id="' +
                item.type +
                '" value="' +
                item.data +
                '"/></componentData>'
        })
        xmlString = xmlString + '</templateData>'
        return xmlString
    }
}

export default HandleOverlay
