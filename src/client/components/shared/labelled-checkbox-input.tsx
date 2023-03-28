import React from "react"
import Label from "./label"

interface LabelledCheckboxInputProps {
  value: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledCheckboxInput(props: LabelledCheckboxInputProps): JSX.Element {
  return (
    <Label className={props.labelClassName} 
      description={props.description}>
      <input type="checkbox" 
        checked={props.value} 
        onChange={props.onChange}
        className={props.inputClassName}/>
    </Label>
  )
}