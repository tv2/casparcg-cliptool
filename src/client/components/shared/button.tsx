import React from "react";

interface ButtonProps {
  onClick: () => void
  text?: string
  className?: string
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <button onClick={props.onClick} className={props.className}>
      {props.text}
    </button>
  )
}