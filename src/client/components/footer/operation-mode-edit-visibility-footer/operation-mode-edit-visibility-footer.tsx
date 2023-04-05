import React from "react"
import { Footer } from "../footer/footer"
import './operation-mode-edit-visibility-footer.scss'
import socketService from "../../../services/socket-service"
import appNavigationService from "../../../../model/services/app-navigation-service"
import { state } from "../../../../model/reducers/store"

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
  socketService.emitSetOperationModeToControl(appNavigationService.getActiveTab(state.appNavigation))
}