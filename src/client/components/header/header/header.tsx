import React from 'react'
import { state } from '../../../../model/reducers/store'

import Timer from '../timer/timer'
import ControlActions from '../control-actions/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './header.scss'
import changingSettingsService from '../../../services/changing-settings-service'
import ActionGroup from '../action-group/action-group'

export default function Header(): JSX.Element {  
    return (
        <header className="app-header">
            <div className="app-header__controls">
                {!browserService.isTextView() && (
                    <ActionGroup>
                        <Button
                            className="app-settings-button"
                            onClick={() => emitToggleSettingsVisibility()}
                        >SETTINGS</Button>
                    </ActionGroup>
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