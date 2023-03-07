import React from 'react'
import { reduxStore, reduxState } from '../../../model/reducers/store'
import { useSelector } from 'react-redux'
import { TOGGLE_SHOW_SETTINGS } from '../../../model/reducers/appNavAction'

//CSS files:
import '../../css/App.css'
import '../../css/App-header.css'
import '../../css/App-control-view-header.css'
import '../../css/App-text-view-header.css'
import Time from './Time'
import HeaderButtons from './HeaderButtons'

export default function Header() {
    const connectionStatus: boolean = useSelector(
        (storeUpdate: any) => storeUpdate.appNav[0].connectionStatus)

    return (
        <header className="App-header">
            <div className="App-header__controls">
                {reduxState.appNav[0].selectView === 0 ? (
                    <div className="App-reload-setup-background">
                        <button
                            className="App-settings-button"
                            onClick={() => handleSettingsPage()}
                        >
                            SETTINGS
                        </button>
                    </div>
                ) : (
                    ''
                )}

                <Time />
                <HeaderButtons />
            </div>            
            {!connectionStatus ? (
                <div className="App-header-server-offline">CONNECTING TO SERVER...</div>
            ) : null}
        </header>
    )
}

const handleSettingsPage = () => {
    reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
    })
}