import React from "react";

import '../../css/Footer.css'

interface FooterContentProps {
  descriptionText: string
  buttonText: string
  onClick: () => void
}

export function FooterContent(props: FooterContentProps): JSX.Element {
  return (
  <div className='Footer-flex'>
    <div className='Footer-text'>
       {props.descriptionText}
      </div>        
      <button onClick={props.onClick} className='Footer-button'>
        {props.buttonText}
      </button>
  </div>
  )
}