import React from "react"
import './text-input.scss'
import '../label/label.scss'

interface TextInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  className?: string
}

export default function TextInput(props: TextInputProps): JSX.Element {
  return (
    <div className={`c-text-input ${props.className ?? ''}`}>
      {props.description ? (
        <label className="label">
          {props.description}
        </label>
      ) : ''}
      <input type="text" 
        value={props.value} 
        onChange={props.onChange}
        className='c-text-input__input' />
    </div>
  )
}