import React from 'react'

import TimerThumbnail from '../timer-thumbnail/timer-thumbnail'
import ControlActions from '../control-actions/control-actions'
import browserService from '../../../services/browser-service'
import Button from '../../shared/button'
import './application-header.scss'
import Group from '../group/group'
import { reduxStore } from '../../../../shared/store'
import { toggleSettingsVisibility } from '../../../../shared/actions/app-navigation-action'

export default function ApplicationHeader(): JSX.Element {
    return (
        <header className='app-header'>
            <div className="app-header__controls">
                {!browserService.isTextView() && (
                    <Group>
                        <Button
                            className="app-settings-button"
                            onClick={() => showSettings()}
                        >
                            SETTINGS
                        </Button>
                    </Group>
                )}

                <TimerThumbnail />
                <ControlActions />
            </div>                        
        </header>
    )
}

function showSettings(): void {
    reduxStore.dispatch(toggleSettingsVisibility())
}