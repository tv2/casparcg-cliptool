import React from "react"
import Label from "./label"

interface LabelledNumberInputProps {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  numberUnit?: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledNumberInput(props: LabelledNumberInputProps): JSX.Element {
  return (
    <Label className={props.labelClassName} 
      description={props.description}>
      <input type="number" 
        value={props.value} 
        onChange={props.onChange}
        className={props.inputClassName}/>
      {props.numberUnit ?? ''}
    </Label>
  )
}