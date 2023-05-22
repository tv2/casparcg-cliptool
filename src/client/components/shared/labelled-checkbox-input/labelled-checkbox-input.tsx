import React from "react"
import Label from "../label"
import './labelled-checkbox-input.scss'

interface LabelledCheckboxInputProps {
  value: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledCheckboxInput(props: LabelledCheckboxInputProps): JSX.Element {
  const inputClassNames = [
    'c-labelled-checkbox-input',
    props.inputClassName ?? ''
  ].join('')
  return (
    <Label className={props.labelClassName ?? ''} 
      description={props.description}>
      <input type="checkbox" 
        checked={props.value} 
        onChange={props.onChange}
        className={inputClassNames}/>
    </Label>
  )
}