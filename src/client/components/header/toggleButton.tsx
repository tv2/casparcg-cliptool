import React from "react"

import '../../css/Header.css'

interface ToggleButtonProps {
  onClick: () => void
  description: string
  isToggled: boolean
  children?: React.ReactNode
}

export default function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const classNames: string = [
    'header-toggle-button',
    props.isToggled ? 'on' : ''
  ].join(' ')

  return (
    <div className="header-button-background">
      <button
          className={classNames}
          onClick={props.onClick}
      >
          {props.description}
      </button>
      {props.children}
  </div>
  )
}