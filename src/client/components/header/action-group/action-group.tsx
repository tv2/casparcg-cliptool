import React from "react";
import './control-group.scss'

interface ActionGroupProps {
  children: React.ReactNode
}

export default function ActionGroup(props: ActionGroupProps): JSX.Element {
  return (
  <div className="c-action-group">
    {props.children}
  </div>
  )
}