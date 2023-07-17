import React from 'react'

import './header.scss'
import { reduxStore } from '../../../../shared/store'
import { toggleSettingsVisibility } from '../../../../shared/actions/app-navigation-action'
import { BrowserService } from '../../../shared/services/browser-service'
import Group from '../group/group'

interface HeaderProps {
    children?: React.ReactNode
}

export default function Header(props: HeaderProps): JSX.Element {
    const browserService = new BrowserService()
    const isTextView = browserService.isTextView()
    return (
        <header className='c-header'>
            <div className="c-header__controls">
                {!isTextView && (
                    <Group>
                        <button
                            className="c-header__settings-button"
                            onClick={() => showSettings()}
                        >
                            SETTINGS
                        </button>
                    </Group>
                )}
                {props.children}
            </div>                        
        </header>
    )
}

function showSettings(): void {
    reduxStore.dispatch(toggleSettingsVisibility())
}