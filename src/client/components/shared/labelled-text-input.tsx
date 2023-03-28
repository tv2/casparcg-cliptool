import React from "react"
import Label from "./label"

interface LabelledTextInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description: string
  labelClassName?: string
  inputClassName?: string
}

export default function LabelledTextInput(props: LabelledTextInputProps): JSX.Element {
  return (
    <Label className={props.labelClassName} 
      description={props.description}>
      <input type="text" 
        value={props.value} 
        onChange={props.onChange}
        className={props.inputClassName}/>
    </Label>
  )
}