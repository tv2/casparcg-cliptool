import React from 'react'
import './toggle.scss'

interface ToggleProps {
  onChange: (isChecked: Boolean) => void
  checked: boolean
  children?: string
}
export default function Toggle(props: ToggleProps): JSX.Element {
 return (
  <button 
    className={`c-toggle toggle ${props.checked ? 'on' : ''}`} 
    onClick={() => props.onChange(props.checked)}>
    {props.children}
  </button>
 ) 
}