import React from 'react'

import TimerThumbnail from '../timer-thumbnail/timer-thumbnail'
import ControlActions from '../control-actions/control-actions'
import Header from '../../../shared/components/header/header'

export default function MediaControlHeader(): JSX.Element {
    return (
        <Header>            
            <TimerThumbnail />
            <ControlActions />
        </Header>
    )
}
