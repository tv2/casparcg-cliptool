import React from 'react'
import { reduxStore, reduxState } from '../../../model/reducers/store'
import { useSelector } from 'react-redux'
import { TOGGLE_SHOW_SETTINGS } from '../../../model/reducers/appNavAction'

import '../../css/App.css'
import '../../css/App-header.css'
import '../../css/App-control-view-header.css'
import '../../css/App-text-view-header.css'
import Time from './time'
import HeaderButtons from './headerButtons'
import { ReduxStateType } from '../../../model/reducers/indexReducer'

export default function Header(): JSX.Element {
    const connectionStatus: boolean = useSelector(
        (storeUpdate: ReduxStateType) => storeUpdate.appNav.connectionStatus)

    return (
        <header className="App-header">
            <div className="App-header__controls">
                {reduxState.appNav.selectView === 0 && (
                    <div className="App-reload-setup-background">
                        <button
                            className="App-settings-button"
                            onClick={() => handleSettingsPage()}
                        >
                            SETTINGS
                        </button>
                    </div>
                )}

                <Time />
                <HeaderButtons />
            </div>            
            {!connectionStatus && (
                <div className="App-header-server-offline">CONNECTING TO SERVER...</div>
            )}
        </header>
    )
}

function handleSettingsPage(): void {
    // TODO: Figure out how to do the discard check here, and allow the user to close via this again.
    if (!reduxState.appNav.showSettingsActive) {
        reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
        })
    }
}