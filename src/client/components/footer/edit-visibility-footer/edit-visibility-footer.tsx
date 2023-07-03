import React from "react"
import { Footer } from "../footer/footer"
import './edit-visibility-footer.scss'
import Button from "../../shared/button"
import { SocketOperationService } from "../../../services/socket-operation-service"
import { state } from "../../../../shared/store"
import { AppNavigationService } from "../../../../shared/services/app-navigation-service"
import { SocketService } from "../../../services/socket-service"


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
  new SocketOperationService(SocketService.instance.getSocket()).setOperationModeToControl(new AppNavigationService().getActiveTabIndex(state.appNavigation))
}