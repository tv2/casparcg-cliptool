import React from 'react'
import { reduxStore, reduxState } from '../../../model/reducers/store'
import { TOGGLE_SHOW_SETTINGS } from '../../../model/reducers/app-navigation-action'

import '../../css/App.css'
import '../../css/App-header.css'
import '../../css/App-control-view-header.css'
import '../../css/App-text-view-header.css'
import Time from './time'
import ControlButtons from './control-buttons/control-buttons'
import browserService from '../../services/browser-service'

export default function Header(): JSX.Element {  
    return (
        <header className="App-header">
            <div className="App-header__controls">
                {browserService.isOrdinaryView() && (
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
        </header>
    )
}

function emitToggleSettingsVisibility(): void {
    // TODO: Figure out how to do the discard check here, and allow the user to close via this again.
    if (!reduxState.appNavigation.isSettingsOpen) {
        reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
        })
    }
}