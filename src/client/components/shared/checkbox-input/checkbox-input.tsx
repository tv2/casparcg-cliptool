import React from "react"
import './checkbox-input.scss'
import '../label/label.scss'

interface CheckboxInputProps {
  value: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  wrapperClassName?: string
  inputClassName?: string
}

export default function CheckboxInput(props: CheckboxInputProps): JSX.Element { 
  return (
    <div className={`${props.wrapperClassName ?? ''}`}>
      {props.description ? (
        <label className="label">
          {props.description}
        </label>
      ) : ''}
      <input type="checkbox" 
        checked={props.value} 
        onChange={props.onChange}
        className={`c-checkbox-input ${props.inputClassName ?? ''}`} />
    </div>
  )
}