import React from "react";
import './group.scss'

interface GroupProps {
  children: React.ReactNode
  className?: string
}

export default function Group(props: GroupProps): JSX.Element {
  return (
  <div className={`c-group ${props.className ?? ''}`}>
    {props.children}
  </div>
  )
}