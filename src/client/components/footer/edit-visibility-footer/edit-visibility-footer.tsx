import React from "react"
import { Footer } from "../footer/footer"
import './edit-visibility-footer.scss'
import socketService from "../../../services/socket-service"
import appNavigationService from "../../../../model/services/app-navigation-service"
import { state } from "../../../../model/reducers/store"
import Button from "../../shared/button"


export function EditVisibilityFooter(): JSX.Element {
  return (        
      <Footer>
        <div className="edit-visibility-footer">
          <div className="edit-visibility-footer__text">
            YOU ARE CURRENTLY EDITING THE VISIBILITY OF THE MEDIA FILES.
          </div>
          <div className="edit-visibility-footer__controls">
            <Button onClick={ resetOperationMode } className="edit-visibility-footer__button" >Exit Edit Visibility</Button>
          </div>
        </div>
      </Footer>
  )
}

function resetOperationMode(): void {
  socketService.emitSetOperationModeToControl(appNavigationService.getActiveTabIndex(state.appNavigation))
}