import React from "react"
import '../shared.scss'

interface LabelProps {
  description: string
  className?: string
  children?: React.ReactNode
}

export default function Label(props: LabelProps): JSX.Element {
  return (
    <label className={`${props.className ?? ''}`} >
      <span className="label">{props.description}</span>
      {props.children ?? ''}
    </label>
  )
}