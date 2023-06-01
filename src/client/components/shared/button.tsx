import React from "react";

interface ButtonProps {
  onClick: () => void
  className?: string
  children?: React.ReactNode
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div onClick={props.onClick} className={props.className ?? ''}>
      {props.children ?? ''}
    </div>
  )
}