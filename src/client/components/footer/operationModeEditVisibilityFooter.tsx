import React from "react"
import * as IO from '../../../model/socketIoConstants'
import { socket } from '../../util/socketClientHandlers'
import { Footer } from "./footer"
import "../../css/Operation-mode-edit-visibility-footer.css"
import { OperationMode } from "../../../model/reducers/settingsModels"
import appNavigationService from "../../../model/services/appNavigationService"
import { reduxState } from "../../../model/reducers/store"

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
    IO.SET_OPERATION_MODE, 
    appNavigationService.getActiveTab(reduxState.appNavigation), 
    OperationMode.CONTROL
  )
}