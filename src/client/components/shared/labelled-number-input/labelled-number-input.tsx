import React from "react"
import Label from "../label"
import './labelled-number-input.scss'

interface LabelledNumberInputProps {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  unit?: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledNumberInput(props: LabelledNumberInputProps): JSX.Element {
  const inputClassNames = [
    'c-labelled-number-input',
    props.inputClassName ?? ''
  ].join('')
  return (
    <Label className={props.labelClassName ?? ''} 
      description={props.description}>
      <input type="number" 
        value={props.value} 
        onChange={props.onChange}
        className={inputClassNames}/>
      {props.unit ?? ''}
    </Label>
  )
}