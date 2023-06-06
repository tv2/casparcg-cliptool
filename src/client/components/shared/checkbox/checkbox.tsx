import React from "react"
import './checkbox.scss'
import '../label/label.scss'

interface CheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  className?: string
}

export default function Checkbox(props: CheckboxProps): JSX.Element { 
  return (
    <div className={`${props.className ?? ''}`}>
      {props.description ? (
        <label className="label">
          {props.description}
        </label>
      ) : ''}
      <input type="checkbox" 
        checked={props.checked} 
        onChange={props.onChange}
        className='c-checkbox' />
    </div>
  )
}