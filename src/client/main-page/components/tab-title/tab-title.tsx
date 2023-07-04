import React from "react"
import './tab-title.scss'

interface TabTitleProps {
  title: string
  onClick: () => void
  isSelected: boolean
}

export default function TabTitle(props: TabTitleProps): JSX.Element {
  return (
    <div className={`tab-title ${props.isSelected ? 'active' : ''}`} 
      role='tab'
        aria-selected={props.isSelected} 
        key={props.title}
        onClick={() => props.onClick()}
      >
      {props.title}
    </div> 
  )
}