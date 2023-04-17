import React from "react"
import Label from "../label"
import './labelled-text-input.scss'

interface LabelledTextInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledTextInput(props: LabelledTextInputProps): JSX.Element {
  const inputClassNames = [
    'c-labelled-text-input',
    props.inputClassName ?? ''
  ].join('')
  return (
    <Label className={props.labelClassName ?? ''} 
      description={props.description}>
      <input type="text" 
        value={props.value} 
        onChange={props.onChange}
        className={inputClassNames}/>
    </Label>
  )
}