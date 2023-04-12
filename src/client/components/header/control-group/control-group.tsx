import React from "react";
import './control-group.scss'

interface ControlGroupProps {
  children: React.ReactNode
}

export default function ControlGroup(props: ControlGroupProps): JSX.Element {
  return (
  <div className="control-background">
    {props.children}
  </div>
  )
}