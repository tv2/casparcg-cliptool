import React from "react"
import './checkbox.scss'
import '../shared.scss'

interface CheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  className?: string
}

export default function Checkbox(props: CheckboxProps): JSX.Element { 
  return (
    <div className={`c-checkbox ${props.className ?? ''}`}>
      <label>
        {props.description ? props.description : ''}
        <input type="checkbox" 
          checked={props.checked} 
          onChange={props.onChange}
          className='c-checkbox__input' />
      </label>
    </div>
  )
}