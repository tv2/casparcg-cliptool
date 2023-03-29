import React from 'react'
import { reduxStore, reduxState } from '../../../model/reducers/store'
import { useSelector } from 'react-redux'
import { TOGGLE_SHOW_SETTINGS } from '../../../model/reducers/app-navigation-action'

import '../../css/App.css'
import '../../css/App-header.css'
import '../../css/App-control-view-header.css'
import '../../css/App-text-view-header.css'
import Time from './time'
import ControlButtons from './control-buttons'
import { State } from '../../../model/reducers/index-reducer'

export default function Header(): JSX.Element {
    const connectionStatus: boolean = useSelector(
        (storeUpdate: State) => storeUpdate.appNavigation.connectionStatus)

    return (
        <header className="App-header">
            <div className="App-header__controls">
                {reduxState.appNavigation.selectView === 0 && (
                    <div className="App-reload-setup-background">
                        <button
                            className="App-settings-button"
                            onClick={() => emitToggleSettingsVisibility()}
                        >
                            SETTINGS
                        </button>
                    </div>
                )}

                <Time />
                <ControlButtons />
            </div>            
            {!connectionStatus && (
                <div className="App-header-server-offline">CONNECTING TO SERVER...</div>
            )}
        </header>
    )
}

function emitToggleSettingsVisibility(): void {
    // TODO: Figure out how to do the discard check here, and allow the user to close via this again.
    if (!reduxState.appNavigation.showSettingsActive) {
        reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
        })
    }
}