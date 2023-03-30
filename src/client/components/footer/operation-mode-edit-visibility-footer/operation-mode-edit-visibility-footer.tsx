import React from "react"
import { ClientToServer } from '../../../../model/socket-io-constants'
import { socket } from '../../../util/socketClientHandlers'
import { Footer } from "../footer/footer"
import { OperationMode } from "../../../../model/reducers/settings-models"
import appNavigationService from "../../../../model/services/app-navigation-service"
import { state } from "../../../../model/reducers/store"
import './operation-mode-edit-visibility-footer.scss'

const BUTTON_TEXT = 'Exit Edit Visibility'
const DESCRIPTION_TEXT = 'You are currently editing the visibility of files.'.toUpperCase()

export function OperationModeEditVisibilityFooter(): JSX.Element {
  return (        
      <Footer>
        <div className="operation-mode-edit-visibility-footer">
          <div className="operation-mode-edit-visibility-footer__text">
            { DESCRIPTION_TEXT }
          </div>
          <div className="operation-mode-edit-visibility-footer__controls">
            <button onClick={ resetOperationMode }>{ BUTTON_TEXT }</button>
          </div>
        </div>
      </Footer>
  )
}

function resetOperationMode(): void {
  socket.emit(
    ClientToServer.SET_OPERATION_MODE, 
    appNavigationService.getActiveTab(state.appNavigation), 
    OperationMode.CONTROL
  )
}