import React from "react"

interface LabelProps {
  description: string
  className?: string
  children: React.ReactNode
}

export default function Label(props: LabelProps): JSX.Element {
  return (
    <label className={props.className} >
      {props.description}
      <br/>
      {props.children}
    </label>
  )
}