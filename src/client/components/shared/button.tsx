import React from "react";

interface ButtonProps {
  onClick: () => void
  classNames?: string
  children?: React.ReactNode

}

export default function Button(props: ButtonProps): JSX.Element {

  return (
    <div onClick={props.onClick} className={props.classNames}>
      {props.children ?? ''}
    </div>
  )
}