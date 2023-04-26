import React from "react";
import './action-group.scss'

interface ActionGroupProps {
  children: React.ReactNode
  classNames?: string
}

export default function ActionGroup(props: ActionGroupProps): JSX.Element {
  return (
  <div className={`c-action-group ${props.classNames ?? ''}`.trimEnd()}>
    {props.children}
  </div>
  )
}