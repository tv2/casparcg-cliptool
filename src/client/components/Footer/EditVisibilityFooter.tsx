import React from "react"
import { FooterContent } from "./FooterContent"

const BUTTON_TEXT = 'Exit Edit Visibility'
const DESCRIPTION_TEXT = 'You are currently editing the visibility of files.'.toUpperCase()

interface EditVisibilityFooterProps {
  onClick: () => void
}

export function EditVisibilityFooter(props: EditVisibilityFooterProps): JSX.Element {
  return (        
      <FooterContent 
        buttonText={BUTTON_TEXT} 
        descriptionText={DESCRIPTION_TEXT}
        onClick={props.onClick}/>
  )
}