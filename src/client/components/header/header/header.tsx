import React from 'react'
import { state } from '../../../../model/reducers/store'

import Timer from '../timer/timer'
import ControlActions from '../control-buttons/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './header.scss'
import changingSettingsService from '../../../services/changing-settings-service'
import ControlGroup from '../control-group/control-group'

export default function Header(): JSX.Element {  
    return (
        <header className="app-header">
            <div className="app-header__controls">
                {!browserService.isTextView() && (
                    <ControlGroup>
                        <Button
                            className="app-settings-button"
                            onClick={() => emitToggleSettingsVisibility()}
                            text="SETTINGS"
                        />
                    </ControlGroup>
                )}

                <Timer />
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