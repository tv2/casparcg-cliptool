import React from 'react'
import { state } from '../../../../model/reducers/store'

import Time from '../timer/timer'
import ControlActions from '../control-buttons/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './header.scss'
import changingSettingsService from '../../../services/changing-settings-service'

export default function Header(): JSX.Element {  
    return (
        <header className="app-header">
            <div className="app-header__controls">
                {!browserService.isTextView() && (
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
    if (!state.appNavigation.isSettingsOpen) {
        changingSettingsService.toggleSettingsPage()
    } else {
        changingSettingsService.discardSettings()
    }
}