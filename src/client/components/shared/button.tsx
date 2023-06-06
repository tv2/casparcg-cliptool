import React from "react";

interface ButtonProps {
  onClick: () => void
  className?: string
  children?: string
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <button onClick={props.onClick} className={props.className ?? ''}>
      {props.children ?? ''}
    </button>
  )
}