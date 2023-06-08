import React from "react"
import { Footer } from "../footer/footer"
import './edit-visibility-footer.scss'
import Button from "../../shared/button"
import backendOperationApi from "../../../services/backend-operation-api"
import { state } from "../../../../shared/store"
import appNavigationService from "../../../../shared/services/app-navigation-service"


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
  backendOperationApi.emitSetOperationModeToControl(appNavigationService.getActiveTabIndex(state.appNavigation))
}