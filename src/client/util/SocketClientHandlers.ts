import { reduxStore, reduxState } from '../reducers/store'

//Apollo-Client Graphql implementation:
import {
    ALL_CHANNELS_QUERY,
    ALL_CHANNELS_SUBSCRIPTION,
} from '../graphql/CasparCgQuery'

/*
checkConnectionStatus() {
    let { appNav, data } = reduxState
    window.apolloClient
        .query({
            query: gql`
                {
                    serverOnline
                }
            `,
        })
        .then((response) => {
            this.props.dispatch({
                type: 'SET_CONNECTION_STATUS',
                data: response.data.serverOnline,
            })
            //Check order of clips:
            loadClipToolCommonSettings(
                this.ccgConnection,
                reduxState.settings,
                reduxState.appNav[0].showSettingsActive
            )
            this.loadThumbs.sortThumbnails(
                data[0].channel[appNav[0].activeTab].thumbList,
                appNav[0].activeTab + 1
            )
            this.updatePlayingStatus(appNav[0].activeTab)

            this.handleAutoNext.isAutoNextStopped()
        })
        .catch((error) => {
            console.log(error)
            this.props.dispatch({
                type: 'SET_CONNECTION_STATUS',
                data: false,
            })
        })
}


ccgSubscribeTimeLeft() {
    var _this2 = this
    //Subscribe to CasparCG-State changes:

    window.apolloClient
        .subscribe({
            query: gql`
                subscription {
                    timeLeft {
                        timeLeft
                        time
                    }
                }
            `,
        })
        .subscribe({
            next(response) {
                _this2.props.dispatch({
                    type: 'SET_TIMELEFT',
                    data: response.data,
                })
                if (!_this2.props.store.settings[0].disableOverlay) {
                    response.data.timeLeft.map((item, index) => {
                        _this2.handleAutoNext.autoNext(item, index)
                        _this2.handleOverlay.handleOverlay(item, index)
                        _this2.handleOverlay.handleWipe(item, index)
                    })
                }
            },
            error(err) {
                console.error('Subscription error: ', err)
            },
        })

}

ccgSubscribeInfoData() {
    var _this2 = this;
    //Initial query channels to object:
    window.apolloClient.query({
    query: ALL_CHANNELS_QUERY
    })
    .then((response) => {
        console.log("InfoData request Data: ", response.data);
        _this2.props.dispatch({
            type:'SET_INFO_CHANNEL',
            data: response.data.channels
        });
        response.data.channels.map((item,index) => {
            _this2.loadThumbs.loadThumbs(index + 1)
            .then(() => {
                _this2.updatePlayingStatus(index);
            });
        });


        //Subscribe to CasparCG-State changes:
        window.apolloClient.subscribe({
            query: ALL_CHANNELS_SUBSCRIPTION
        })
        .subscribe({
            next(response) {
                _this2.props.dispatch({
                    type:'SET_LAYER_10',
                    data: response.data
                });
                response.data.playLayer.map((item,index) => {
                    _this2.updatePlayingStatus(index);
                });

            },
            error(err) { console.error('Subscription error: ', err); },
        });
    });
}

ccgMediaFilesChanged() {
    var _this2 = this;

    //Get list of media folders:
    window.apolloClient.query({
        query: gql`{
            mediaFolders {
                folder
            }
        }`
    })
    .then((response) => {
        this.mediaFolders = response.data.mediaFolders.map((item)=> {
            return {value: item.folder, label: item.folder};
        });
    });

    //Get list of data folders:
    window.apolloClient.query({
        query: gql`{
            dataFolders {
                folder
            }
        }`
    })
    .then((response) => {
        this.dataFolders = response.data.dataFolders.map((item)=> {
            return {value: item.folder, label: item.folder};
        });
    });

    //Get list of template folders:
    window.apolloClient.query({
        query: gql`{
            templateFolders {
                folder
            }
        }`
    })
    .then((response) => {
        this.templateFolders = response.data.templateFolders.map((item)=> {
            return {value: item.folder, label: item.folder};
        });
    });

    //Subscribe to CasparCG-State changes:
    window.apolloClient.subscribe({
        query: gql`
            subscription {
                mediaFilesChanged
            }`
    })
    .subscribe({
        next(response) {
            console.log("Media Files Changed");
            _this2.localState.tabData.map((data, index) => {
                _this2.loadThumbs.loadThumbs(index+1);
            });
        },
        error(err) { console.error('Subscription error: ', err); },
    });
}


updatePlayingStatus(tab) {
    //Don´t update if data not loaded:
    if (reduxState.data[0].ccgInfo.length < 1) {
        console.log("Still loading....");
        return;
    }

    var infoStatus = reduxState.data[0].ccgInfo[tab].layers[10-1] || '';

    var fileNameFg = cleanUpFilename(infoStatus.foreground.name || '');
    var fileNameBg = cleanUpFilename(infoStatus.background.name || '');
    reduxState.data[0].channel[tab].thumbList
    .map((item, index)=>{

        //Handle Foreground:
        if(item.name.includes(fileNameFg)) {
            this.props.dispatch({
                type: 'SET_THUMB_ACTIVE_INDEX',
                data: {
                    tab: tab,
                    thumbActiveIndex: index
                }
            });
        }
        //Handle Background:
        if(item.name.includes(fileNameBg)) {
            this.props.dispatch({
                type: 'SET_THUMB_ACTIVE_BG_INDEX',
                data: {
                    tab: tab,
                    thumbActiveBgIndex: index
                }
            });
        }
    });
}


export const socketClientHandlers = () => {
/*    window.socketIoClient
        .on('connect', () => {
            window.storeRedux.dispatch(storeSetServerOnline(true))
            console.log('CONNECTED TO SISYFOS SERVER')
            if (!window.location.search.includes('vu=0')) {
                // subscribe to VU'
                window.socketIoClient.emit(
                    'subscribe-vu-meter',
                    'subscribe to vu meters'
                )
            }
        })
        .on('disconnect', () => {
            window.storeRedux.dispatch(storeSetServerOnline(false))
            console.log('LOST CONNECTION TO SISYFOS SERVER')
        })
        .on(SOCKET_SET_FULL_STORE, (payload: any) => {
            // console.log('STATE RECEIVED :', payload)
            if (window.mixerProtocol) {
                let numberOfChannels: InumberOfChannels[] = []
                payload.channels[0].chMixerConnection.forEach(
                    (
                        chMixerConnection: IchMixerConnection,
                        mixerIndex: number
                    ) => {
                        numberOfChannels.push({ numberOfTypeInCh: [] })
                        numberOfChannels[mixerIndex].numberOfTypeInCh = [
                            chMixerConnection.channel.length,
                        ]
                    }
                )
                window.storeRedux.dispatch(
                    storeSetCompleteChState(
                        payload.channels[0],
                        numberOfChannels
                    )
                )
                window.storeRedux.dispatch(
                    storeSetCompleteFaderState(
                        payload.faders[0],
                        payload.settings[0].numberOfFaders
                    )
                )
                payload.settings[0].mixers.forEach(
                    (mixer: IMixerSettings, i: number) => {
                        window.storeRedux.dispatch(
                            storeSetMixerOnline(i, mixer.mixerOnline)
                        )
                    }
                )
                window.storeRedux.dispatch(storeSetServerOnline(true))
            }
        })
        .on('set-settings', (payload: any) => {
            // console.log('SETTINGS RECEIVED :', payload)
            window.storeRedux.dispatch(storeUpdateSettings(payload))
        })
        */
//}
