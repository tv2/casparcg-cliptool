//Utils:
import {
    cleanUpFilename,
    extractFilenameFromPath,
} from '../../client/util/filePathStringHandling'
import { reduxStore, reduxState } from '../../model/reducers/store'

/*
export const loadThumbs = () => {
    return new Promise((resolve, reject) => {
        let { ccgConnection } = this
        //Filter files manually as
        //CCG 2.2 does not support subfolder argument in the CLS command
        let subFolder = cleanUpFilename(
            reduxState.settings[0].tabData[ccgOutput - 1].subFolder
        )
        //Remove first backslash if it´s there:
        subFolder =
            subFolder.length && subFolder[0] === '/'
                ? subFolder.slice(1)
                : subFolder

        this.ccgConnection
            .cls()
            .then((results) => {
                let items = results.response.data.filter((item) => {
                    return (
                        item.type === 'video' && item.name.includes(subFolder)
                    )
                })
                if (items.length === 0) return false
                reduxStore.dispatch({
                    type: 'SET_THUMB_LENGTH',
                    data: {
                        tab: ccgOutput - 1,
                        length: items.length,
                    },
                })
                items = this.sortThumbnails(items, ccgOutput)

                items.map((item, index) => {
                    var currentAtIndex = reduxState.data[0].channel[
                        ccgOutput - 1
                    ].thumbList[index] || { name: '' }
                    if (item.name != currentAtIndex) {
                        item.tally = false
                        item.tallyBg = false
                        reduxStore.dispatch({
                            type: 'SET_THUMB_LIST',
                            data: {
                                tab: ccgOutput - 1,
                                index: index,
                                thumbList: item,
                            },
                        })

                        this.getMetaData(item.name, ccgOutput, index)
                        this.getThumbnail(item.name, ccgOutput, index)
                        resolve('Everythings loaded')
                    }
                })
                console.log('Channel: ', ccgOutput, ' loaded')
            })
            .catch((error) => {
                console.log('Error :', error)
                if (error.response.code === 404) {
                    window.alert(
                        'Folder: ' +
                            reduxState.settings[0].tabData[0].subFolder +
                            ' does not exist'
                    )
                }
            })
    })
}

const getMetaData = (name, ccgOutput, index) => {
    let dataName =
        reduxState.settings[0].tabData[ccgOutput - 1].dataFolder +
        '/' +
        extractFilenameFromPath(name) +
        '.meta'
    //Remove first slash in foldeName if it´s there:
    dataName = dataName[0] === '/' ? dataName.slice(1) : dataName

    ccgConnection
        .dataRetrieve(dataName)
        .then((data) => {
            reduxStore.dispatch({
                type: 'SET_META_LIST',
                index: index,
                tab: ccgOutput - 1,
                metaList: JSON.parse(data.response.data).channel[0].metaList,
            })
        })
        .catch((error) => {
            reduxStore.dispatch({
                type: 'SET_EMPTY_META',
                index: index,
                tab: ccgOutput - 1,
            })
        })
}

const getThumbnail = (name, ccgOutput, index) => {
    ccgConnection.thumbnailRetrieve(name).then((pixResponse) => {
        reduxStore.dispatch({
            type: 'SET_THUMB_PIX',
            data: {
                tab: ccgOutput - 1,
                index: index,
                thumbPix: pixResponse.response.data,
            },
        })
    })
}

const sortThumbnails = (items, ccgOutput) => {
    let placeCounter = 0
    reduxState.data[0].thumbOrder[ccgOutput - 1].list.map((sortItem, index) => {
        items.map((item, index) => {
            if (item.name === sortItem) {
                items.splice(index, 1)
                items.splice(placeCounter, 0, item)
                placeCounter++
                return
            }
        })
    })
    return items
}

*/
