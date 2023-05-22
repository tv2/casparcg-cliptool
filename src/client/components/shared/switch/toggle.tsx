import React from 'react'
import Button from '../button'
import './toggle.scss'

interface ToggleProps {
  onChange: (isChecked: Boolean) => void
  checked: boolean
  classNames?: string
  children?: React.ReactNode
}

export default function Toggle(props: ToggleProps): JSX.Element {
 return (
  <Button 
    classNames={`${props.classNames ?? 'c-switch'} ${props.checked ? 'on' : ''}`.trimEnd()} 
    onClick={() => props.onChange(props.checked)}>
    {props.children}
  </Button>
 ) 
}