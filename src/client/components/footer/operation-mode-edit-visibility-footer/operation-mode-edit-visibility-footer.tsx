import React from "react"
import { Footer } from "../footer/footer"
import './operation-mode-edit-visibility-footer.scss'
import socketService from "../../../services/socket-service"
import appNavigationService from "../../../../model/services/app-navigation-service"
import { state } from "../../../../model/reducers/store"
import Button from "../../shared/button"


export function OperationModeEditVisibilityFooter(): JSX.Element {
  return (        
      <Footer>
        <div className="operation-mode-edit-visibility-footer">
          <div className="operation-mode-edit-visibility-footer__text">
            { 'You are currently editing the visibility of files.'.toUpperCase() }
          </div>
          <div className="operation-mode-edit-visibility-footer__controls">
            <Button onClick={ resetOperationMode } classNames="operation-mode-edit-visibility-footer__button" >Exit Edit Visibility</Button>
          </div>
        </div>
      </Footer>
  )
}

function resetOperationMode(): void {
  socketService.emitSetOperationModeToControl(appNavigationService.getActiveTab(state.appNavigation))
}