//Utils:
import { cleanUpFilename, extractFilenameFromPath } from '../util/filePathStringHandling';

class LoadThumbs {
    constructor (ccgConnection) {
        this.ccgConnection = ccgConnection;
        this.getThumbnail = this.getThumbnail.bind(this);
        this.getMetaData = this.getMetaData.bind(this);

        this.store = window.store.getState ();
        const unsubscribe = store.subscribe (() => {
            this.store = window.store.getState ();
        });
    }

    loadThumbs ( ccgOutput ) {
        let { ccgConnection } = this;
        //Filter files manually as
        //CCG 2.2 does not support subfolder argument in the CLS command
        let subFolder = cleanUpFilename (
            this.store.settings[0].tabData[ccgOutput - 1].subFolder
        );
        //Remove first backslash if it´s there:
        subFolder = (subFolder.length && subFolder[0] === '/')
            ? subFolder.slice (1)
            : subFolder;

        this.ccgConnection.cls ()
        .then (results => {
            let items = results.response.data.filter(item => {
                    return item.type === 'video' && item.name.includes (subFolder);
                });
            if (items.length === 0) return false;
            window.store.dispatch ({
                type: 'SET_THUMB_LENGTH',
                data: {
                    tab: ccgOutput - 1,
                    length: items.length,
                },
            });

            items.map ((item, index) => {
                var currentAtIndex =
                    this.store.data[0].channel[ccgOutput - 1].thumbList[index] | {name: ''};
                if (item.name != currentAtIndex) {
                    item.tally = false;
                    item.tallyBg = false;
                    window.store.dispatch ({
                        type: 'SET_THUMB_LIST',
                        data: {
                            tab: ccgOutput - 1,
                            index: index,
                            thumbList: item,
                        },
                    });

                    this.getMetaData(item.name, ccgOutput, index);
                    this.getThumbnail(item.name, ccgOutput, index);
                }
            });
            console.log ('Channel: ', ccgOutput, ' loaded');
        })
        .catch (error => {
            console.log ('Error :', error);
            if (error.response.code === 404) {
                window.alert (
                    'Folder: ' +
                    this.props.store.settings[0].tabData[
                        this.props.ccgOutput - 1
                    ].subFolder +
                    ' does not exist'
                );
            }
        });
    }

    getMetaData(name, ccgOutput, index) {
        let { ccgConnection } = this;

        let dataName = this.store.settings[0].tabData[ ccgOutput - 1].dataFolder +
                        '/' +
                        extractFilenameFromPath (name) +
                        '.meta';

        ccgConnection.dataRetrieve (dataName)
        .then (data => {
            window.store.dispatch ({
                type: 'SET_META_LIST',
                index: index,
                tab: ccgOutput - 1,
                metaList: JSON.parse (data.response.data).channel[0].metaList,
            });
        })
        .catch (error => {
            window.store.dispatch ({
                type: 'SET_EMPTY_META',
                index: index,
                tab: ccgOutput - 1,
            });
        });
    }

    getThumbnail(name, ccgOutput, index) {
        let { ccgConnection } = this;
        ccgConnection.thumbnailRetrieve (name)
        .then (pixResponse => {
            window.store.dispatch ({
                type: 'SET_THUMB_PIX',
                data: {
                    tab: ccgOutput - 1,
                    index: index,
                    thumbPix: pixResponse.response.data,
                },
            });
        });
    }
}

export default LoadThumbs;
