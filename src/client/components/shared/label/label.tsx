import React from "react"
import './label.scss'

interface LabelProps {
  description: string
  className?: string
  children?: React.ReactNode
}

export default function Label(props: LabelProps): JSX.Element {
  return (
    <label className={`label ${props.className ?? ''}`} >
      <span className="label__title">{props.description}</span>
      {props.children ?? ''}
    </label>
  )
}