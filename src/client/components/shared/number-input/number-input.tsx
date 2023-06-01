import React from "react"
import './number-input.scss'
import '../label/label.scss'

interface NumberInputProps {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  unit?: string
  className?: string
}

export default function NumberInput(props: NumberInputProps): JSX.Element {
  return (
    <div className={`${props.className ?? ''}`}>
      {props.description ? (
        <label className="label">
          {props.description}
        </label>
      ) : ''}
      <input type="number" 
        value={props.value} 
        onChange={props.onChange}
        className='c-number-input'/>
      {props.unit ?? ''}
    </div>
  )
}