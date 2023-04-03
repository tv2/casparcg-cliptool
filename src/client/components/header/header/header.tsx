import React from 'react'
import { reduxStore, state } from '../../../../model/reducers/store'
import { TOGGLE_SHOW_SETTINGS } from '../../../../model/reducers/app-navigation-action'

import Time from '../timer/timer'
import ControlActions from '../control-buttons/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './header.scss'

export default function Header(): JSX.Element {  
    return (
        <header className="app-header">
            <div className="app-header__controls">
                {browserService.isOrdinaryView() && (
                    <div className="app-reload-setup-background">
                        <Button
                            className="app-settings-button"
                            onClick={() => emitToggleSettingsVisibility()}
                            text="SETTINGS"
                        />
                    </div>
                )}

                <Time />
                <ControlActions />
            </div>                        
        </header>
    )
}

function emitToggleSettingsVisibility(): void {
    // TODO: Figure out how to do the discard check here, and allow the user to close via this again.
    if (!state.appNavigation.isSettingsOpen) {
        reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
        })
    }
}