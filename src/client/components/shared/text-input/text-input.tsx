import React from "react"
import './text-input.scss'
import '../label/label.scss'

interface TextInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  wrapperClassName?: string
  inputClassName?: string
}

export default function TextInput(props: TextInputProps): JSX.Element {
  return (
    <div className={`${props.wrapperClassName ?? ''}`}>
      {props.description ? (
        <label className="label">
          {props.description}
        </label>
      ) : ''}
      <input type="text" 
        value={props.value} 
        onChange={props.onChange}
        className={`c-text-input ${props.inputClassName ?? ''}`} />
    </div>
  )
}