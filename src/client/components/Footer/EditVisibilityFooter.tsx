import React from "react"
import { FooterContent } from "./FooterContent"

const buttonText = 'Exit Edit Visibility'
const descriptionText = 'You are currently editing the visibility of files.'.toUpperCase()

interface EditVisibilityFooterProps {
  onClick: () => void
}

export function EditVisibilityFooter(props: EditVisibilityFooterProps): JSX.Element {
  return (        
      <FooterContent 
        buttonText={buttonText} 
        descriptionText={descriptionText}
        onClick={props.onClick}/>
  )
}