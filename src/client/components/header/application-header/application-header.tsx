import React from 'react'
import { state } from '../../../../model/reducers/store'

import TimerThumbnail from '../timer-thumbnail/timer-thumbnail'
import ControlActions from '../control-actions/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './application-header.scss'
import changingSettingsService from '../../../services/changing-settings-service'
import Group from '../group/group'

export default function ApplicationHeader(): JSX.Element {  
    return (
        <header className="app-header">
            <div className="app-header__controls">
                {!browserService.isTextView() && (
                    <Group>
                        <Button
                            className="app-settings-button"
                            onClick={() => emitToggleSettingsVisibility()}
                        >SETTINGS</Button>
                    </Group>
                )}

                <TimerThumbnail />
                <ControlActions />
            </div>                        
        </header>
    )
}

function emitToggleSettingsVisibility(): void {
    if (!state.appNavigation.isSettingsVisible) {
        changingSettingsService.toggleSettingsPage()
    } else {
        changingSettingsService.discardSettings()
    }
}