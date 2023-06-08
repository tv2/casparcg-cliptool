import React from 'react'
import Button from '../button'
import './switch.scss'

interface ToggleProps {
  onChange: (isChecked: Boolean) => void
  checked: boolean
  className?: string
  children?: string
}

export default function Toggle(props: ToggleProps): JSX.Element {
 return (
  <Button 
    className={`${props.className ?? 'c-switch'} ${props.checked ? 'on' : ''}`} 
    onClick={() => props.onChange(props.checked)}>
    {props.children}
  </Button>
 ) 
}