import React from 'react'

import TimerThumbnail from '../timer-thumbnail/timer-thumbnail'
import ControlActions from '../control-actions/control-actions'
import './header.scss'
import Group from '../group/group'
import { reduxStore } from '../../../../shared/store'
import { toggleSettingsVisibility } from '../../../../shared/actions/app-navigation-action'
import { BrowserService } from '../../../shared/services/browser-service'

export default function Header(): JSX.Element {
    return (
        <header className='app-header'>
            <div className="app-header__controls">
                {!new BrowserService().isTextView() && (
                    <Group>
                        <button
                            className="app-settings-button"
                            onClick={() => showSettings()}
                        >
                            SETTINGS
                        </button>
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